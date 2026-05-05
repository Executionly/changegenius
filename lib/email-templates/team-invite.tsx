import React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Button,
} from '@react-email/components'

interface TeamInviteEmailProps {
  invitedByName: string
  invitedByEmail: string
  teamName: string
  inviteLink: string
}

export const TeamInviteEmail: React.FC<TeamInviteEmailProps> = ({
  invitedByName,
  invitedByEmail,
  teamName,
  inviteLink,
}) => {
  return (
    <Html>
      <Head />
      <Preview>You've been invited to join {teamName} on Change Genius™</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            <Text style={logo}>Change Genius™</Text>
          </Section>
          
          <Heading style={h1}>You're invited to join {teamName}</Heading>
          
          <Text style={heroText}>
            <strong>{invitedByName}</strong> ({invitedByEmail}) has invited you to collaborate 
            on Change Genius™ assessments with the <strong>{teamName}</strong> team.
          </Text>

          <Section style={codeBox}>
            <Text style={confirmationCodeText}>
              Click the button below to accept the invitation and get started:
            </Text>
          </Section>

          <Section style={buttonContainer}>
            <Button style={button} href={inviteLink}>
              Join {teamName}
            </Button>
          </Section>

          <Text style={paragraph}>
            Or copy and paste this URL into your browser:{' '}
            <Link href={inviteLink} style={link}>
              {inviteLink}
            </Link>
          </Text>

          <Text style={paragraph}>
            This invitation will expire in 7 days. If you have any questions, 
            reply to this email or contact our support team.
          </Text>

          <Text style={footer}>
            Best regards,<br />
            The Change Genius™ Team
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

// Styles remain the same
const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #eee',
  borderRadius: '8px',
  margin: '40px auto',
  padding: '20px',
  width: '465px',
}

const logoContainer = {
  textAlign: 'center' as const,
  marginBottom: '32px',
}

const logo = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#5469d4',
  textAlign: 'center' as const,
}

const h1 = {
  color: '#000',
  fontFamily: 'HelveticaNeue-Medium,Helvetica,Arial,sans-serif',
  fontSize: '24px',
  fontWeight: 500,
  lineHeight: '24px',
  marginBottom: '16px',
  textAlign: 'center' as const,
}

const heroText = {
  color: '#000',
  fontFamily: 'HelveticaNeue-Medium,Helvetica,Arial,sans-serif',
  fontSize: '16px',
  lineHeight: '24px',
  marginBottom: '16px',
}

const codeBox = {
  background: 'rgb(245, 244, 245)',
  borderRadius: '4px',
  marginBottom: '16px',
  padding: '24px',
}

const confirmationCodeText = {
  fontSize: '14px',
  fontWeight: 'normal' as const,
  lineHeight: '24px',
  margin: '0px',
  textAlign: 'center' as const,
}

const buttonContainer = {
  marginBottom: '16px',
  textAlign: 'center' as const,
}

const button = {
  backgroundColor: '#5469d4',
  borderRadius: '4px',
  color: '#fff',
  fontFamily: 'HelveticaNeue-Medium,Helvetica,Arial,sans-serif',
  fontSize: '16px',
  fontWeight: 'bold',
  lineHeight: '50px',
  textAlign: 'center' as const,
  textDecoration: 'none',
  width: '200px',
  display: 'block',
  margin: '0 auto',
}

const paragraph = {
  color: '#000',
  fontSize: '14px',
  fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif',
  letterSpacing: '0',
  lineHeight: '23px',
  margin: '0',
  marginBottom: '16px',
}

const link = {
  color: '#5469d4',
  textDecoration: 'underline',
}

const footer = {
  color: '#898989',
  fontSize: '12px',
  lineHeight: '22px',
  marginTop: '32px',
}