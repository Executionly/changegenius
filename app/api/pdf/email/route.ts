import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { sendReportEmail } from '@/lib/email'

export const maxDuration = 60
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
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

    const { filePath } = await req.json()
    if (!filePath) return NextResponse.json({ error: 'Missing filePath' }, { status: 400 })

    // Verify the file belongs to the requesting user
    if (!filePath.startsWith(session.user.id)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Download PDF from Supabase Storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('reports')
      .download(filePath)

    if (downloadError || !fileData) {
      console.error('[pdf/email] download error:', downloadError)
      return NextResponse.json({ error: 'Failed to retrieve PDF' }, { status: 500 })
    }

    const pdfBuffer = Buffer.from(await fileData.arrayBuffer())
    const pdfBase64 = pdfBuffer.toString('base64')

    // Get user email + profile
    const { data: { user } } = await supabase.auth.getUser()
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, change_genius_role, change_genius_role_2, role_pair_title')
      .eq('id', session.user.id)
      .single()

    const email = user?.email
    if (!email) return NextResponse.json({ error: 'No email found' }, { status: 400 })

    const firstName = (profile?.full_name ?? 'report')
      .toLowerCase().replace(/\s+/g, '-')

    const result = await sendReportEmail({
      to:            email,
      fullName:      profile?.full_name ?? 'there',
      primaryRole:   profile?.change_genius_role ?? '',
      secondaryRole: profile?.change_genius_role_2 ?? '',
      rolePairTitle: profile?.role_pair_title ?? '',
      pdfBase64,
      fileName:      `${firstName}-change-genius-report.pdf`,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[pdf/email] error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}