import { Resend } from 'resend'
import { render } from '@react-email/render'
import React from 'react'
import { TeamInviteEmail } from './email-templates/team-invite'
import { ReportReadyEmail } from './email-templates/report-readt'
import { TeamReportReadyEmail } from './email-templates/team.report-ready'
import { ContactUsEmail } from './email-templates/contact'

if (!process.env.RESEND_API_KEY || !process.env.NEXT_PUBLIC_MAIL_FORM) {
  throw new Error('RESEND_API_KEY environment variable is required')
}

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendTeamInviteParams {
  to: string
  invitedByName: string
  invitedByEmail: string
  teamName: string
  inviteLink: string
}

interface SendReportEmailParams {
  to: string
  fullName: string
  primaryRole: string
  secondaryRole: string
  rolePairTitle: string
  pdfBase64: string
  fileName: string
}

interface SendTeamReportEmailParams {
  to: string
  ownerName: string
  teamName: string
  memberCount: number
  teamId: string
  pdfBase64: string
}

interface SendContactEmailParams {
  name: string
  email: string
  inquiryType: string
  message: string
  organization?: string
}

export async function sendContactUsEmail({
  name,
  email,
  inquiryType,
  message,
  organization
}: SendContactEmailParams) {
  try {
    const emailElement = React.createElement(ContactUsEmail, {
      name,
      email,
      inquiryType,
      message,
    })

    const html = await render(emailElement)

    const { data, error } = await resend.emails.send({
      from: process.env.NEXT_PUBLIC_MAIL_FORM!,
      to: ['info@changegeniusai.com'],
      subject: `New Contact Form: ${inquiryType}`,
      html,
      text: `From: ${name} (${email})\nSubject: ${inquiryType}\n\n${message}`,
    })

    if (error) throw new Error(error.message)

    return { success: true, id: data?.id }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}

export async function sendTeamReportEmail({
  to,
  ownerName,
  teamName,
  memberCount,
  teamId,
  pdfBase64,
}: SendTeamReportEmailParams) {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://changegeniusai.com'
    const teamUrl = `${appUrl}/teams/${teamId}`

    const emailHtml = await render(
      React.createElement(TeamReportReadyEmail, {
        ownerName,
        teamName,
        memberCount,
        teamUrl,
      })
    )

    const { data, error } = await resend.emails.send({
      from: process.env.NEXT_PUBLIC_MAIL_FORM!,
      to:   [to],
      subject: `Your ${teamName} Team Change Map™ is Ready`,
      html: emailHtml,
      attachments: [
        {
          filename: `${teamName.toLowerCase().replace(/\s+/g, '-')}-team-report.pdf`,
          content:  pdfBase64,
        },
      ],
    })

    if (error) throw new Error(error.message)

    console.log('[Email] Team report sent:', data?.id)
    return { success: true, id: data?.id }
  } catch (error) {
    console.error('[Email] Error sending team report:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function sendReportEmail({
  to,
  fullName,
  primaryRole,
  secondaryRole,
  rolePairTitle,
  pdfBase64,
  fileName,
}: SendReportEmailParams) {
  try {
    const emailHtml = await render(
      React.createElement(ReportReadyEmail, {
        fullName,
        primaryRole,
        secondaryRole,
        rolePairTitle,
      })
    )

    const { data, error } = await resend.emails.send({
      from: process.env.NEXT_PUBLIC_MAIL_FORM!,
      to:   [to],
      subject: `Your Change Genius™ Report — ${rolePairTitle}`,
      html: emailHtml,
      attachments: [
        {
          filename: fileName,
          content:  pdfBase64,
        },
      ],
    })

    if (error) throw new Error(error.message)

    console.log('[Email] Report sent:', data?.id)
    return { success: true, id: data?.id }
  } catch (error) {
    console.error('[Email] Error sending report:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function sendTeamInviteEmail({
  to,
  invitedByName,
  invitedByEmail,
  teamName,
  inviteLink,
}: SendTeamInviteParams) {
  try {
    const emailElement = React.createElement(TeamInviteEmail, {
      invitedByName,
      invitedByEmail,
      teamName,
      inviteLink,
    })

    const emailHtml = await render(emailElement)

    const { data, error } = await resend.emails.send({
      from: process.env.NEXT_PUBLIC_MAIL_FORM!,
      to: [to],
      subject: `You've been invited to join ${teamName} on Change Genius™`,
      html: emailHtml, // Now this is a string, not a Promise<string>
      // Plain text fallback
      text: `You've been invited by ${invitedByName} (${invitedByEmail}) to join ${teamName} on Change Genius™. Visit: ${inviteLink}`,
    })

    if (error) {
      console.error('[Email] Failed to send team invite:', error)
      throw new Error(`Failed to send email: ${error.message}`)
    }

    console.log('[Email] Team invite sent successfully:', data?.id)
    return { success: true, id: data?.id }
  } catch (error) {
    console.error('[Email] Error sending team invite:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}