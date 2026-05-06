import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { buildIndividualReportHTML, generatePDF } from '@/lib/pdf/generator'
import { buildNarrative } from '@/lib/assessment/narratives'
import { type Role, type AdaptsStage, type Energy, STAGES } from '@/lib/assessment/questions'
import type { ScoreResult, StageDetail } from '@/lib/assessment/scoring'
import { getStageBand } from '@/lib/assessment/scoring'

export const maxDuration = 60 // PDF generation can be slow
export const runtime = 'nodejs' // not 'edge'

export async function GET(req: NextRequest) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (s) => s.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Get completed assessment
  const { data: assessment } = await supabase
    .from('assessments')
    .select('id, completed_at')
    .eq('user_id', session.user.id)
    .eq('status', 'completed')
    .order('completed_at', { ascending: false })
    .limit(1)
    .single()

  if (!assessment) return NextResponse.json({ error: 'No completed assessment' }, { status: 404 })

  const { data: scoresRow } = await supabase
    .from('scores')
    .select('role_scores, stage_scores, energy_scores, derived')
    .eq('assessment_id', assessment.id)
    .single()

  if (!scoresRow) return NextResponse.json({ error: 'Scores not found' }, { status: 404 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', session.user.id)
    .single()

  const stage_scores = scoresRow.stage_scores as Record<AdaptsStage, number>

    const scores: ScoreResult = {
      role_scores:   scoresRow.role_scores   as Record<Role, number>,
      stage_scores,
      energy_scores: scoresRow.energy_scores as Record<Energy, number>,
      derived: scoresRow.derived       as ScoreResult['derived'],
      // Reconstruct stage_detail from stored scores (stability/integrity/risk not stored,
      // so default to neutral values — full detail only available at calculation time)
      stage_detail: Object.fromEntries(
        STAGES.map(s => [s, {
          score:      stage_scores[s],
          band:       getStageBand(stage_scores[s]),
          stability:  50,
          integrity:  50,
          risk:       Math.round((100 - stage_scores[s]) * 0.5),
        }])
      ) as Record<AdaptsStage, StageDetail>,
    }

  const narrative = buildNarrative(scores.derived)

  const html = buildIndividualReportHTML({
    fullName:    profile?.full_name ?? null,
    scores,
    narrative,
    completedAt: assessment.completed_at,
  })

  try {
    const pdfBuffer = await generatePDF(html)
    const name = (profile?.full_name ?? 'change-genius').toLowerCase().replace(/\s+/g, '-')
return new NextResponse(html, {
      headers: {
        'Content-Type':        'text/html',
        'Content-Disposition': 'inline',
      },
    })
    // return new NextResponse(new Uint8Array(pdfBuffer), {
    //   headers: {
    //     'Content-Type':        'application/pdf',
    //     'Content-Disposition': `attachment; filename="${name}-change-genius-report.pdf"`,
    //     'Cache-Control':       'private, no-cache',
    //   },
    // })
  } catch (err) {
    console.error('[pdf/individual] Chromium unavailable, returning HTML:', err)
    // Fallback: return print-optimised HTML
    return new NextResponse(html, {
      headers: {
        'Content-Type':        'text/html',
        'Content-Disposition': 'inline',
      },
    })
  }
}
