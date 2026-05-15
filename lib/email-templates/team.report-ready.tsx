import React from 'react'
import {
  Body, Container, Head, Heading, Html,
  Link, Preview, Section, Text, Button,
} from '@react-email/components'

interface TeamReportReadyEmailProps {
  ownerName: string
  teamName: string
  memberCount: number
  teamUrl: string
}

export const TeamReportReadyEmail: React.FC<TeamReportReadyEmailProps> = ({
  ownerName,
  teamName,
  memberCount,
  teamUrl,
}) => {
  const firstName = ownerName?.split(' ')[0] ?? 'there'

  return (
    <Html>
      <Head />
      <Preview>Your {teamName} Team Change Map™ is ready — all {memberCount.toString()} members have completed</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            <Text style={logo}>Change Genius™</Text>
          </Section>

          <Heading style={h1}>Your Team Report is Ready, {firstName}</Heading>

          <Text style={paragraph}>
            All {memberCount} members of <strong>{teamName}</strong> have completed the Change Genius™ Assessment.
            Your full Team Change Map™ is attached to this email as a PDF.
          </Text>

          <Section style={resultsBox}>
            <Text style={resultLabel}>TEAM</Text>
            <Text style={resultValue}>{teamName}</Text>
            <Text style={resultLabel}>MEMBERS COMPLETED</Text>
            <Text style={resultValue}>{memberCount} of {memberCount}</Text>
          </Section>

          <Text style={paragraph}>
            Your attached report includes your team's full ADAPTS™ coverage, role distribution,
            energy mix, friction patterns, and a 90-day team action plan.
          </Text>

          <Section style={{ textAlign: 'center' as const, marginBottom: '24px' }}>
            <Button style={button} href={teamUrl}>
              View Team Dashboard →
            </Button>
          </Section>

          <Text style={paragraph}>
            Have questions? Reply to this email or reach us at{' '}
            <Link href="mailto:info@changegeniusai.com" style={link}>
              info@changegeniusai.com
            </Link>
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

const main = { backgroundColor: '#ffffff', fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif' }
const container = { backgroundColor: '#ffffff', border: '1px solid #eee', borderRadius: '8px', margin: '40px auto', padding: '20px', width: '465px' }
const logoContainer = { textAlign: 'center' as const, marginBottom: '32px' }
const logo = { fontSize: '24px', fontWeight: 'bold', color: '#6B4FBB', textAlign: 'center' as const }
const h1 = { color: '#000', fontSize: '24px', fontWeight: 500, lineHeight: '28px', marginBottom: '16px', textAlign: 'center' as const }
const resultsBox = { background: '#f5f4f5', borderRadius: '8px', padding: '24px', marginBottom: '24px' }
const resultLabel = { fontSize: '10px', color: '#888', letterSpacing: '0.08em', margin: '0 0 2px' }
const resultValue = { fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 12px' }
const paragraph = { color: '#000', fontSize: '14px', lineHeight: '23px', marginBottom: '16px' }
const button = { backgroundColor: '#6B4FBB', borderRadius: '4px', color: '#fff', fontSize: '16px', fontWeight: 'bold', lineHeight: '50px', textAlign: 'center' as const, textDecoration: 'none', width: '220px', display: 'block', margin: '0 auto' }
const link = { color: '#6B4FBB', textDecoration: 'underline' }
const footer = { color: '#898989', fontSize: '12px', lineHeight: '22px', marginTop: '32px' }