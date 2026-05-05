import { Resend } from 'resend'
import { render } from '@react-email/render'
import React from 'react'
import { TeamInviteEmail } from './email-templates/team-invite'

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