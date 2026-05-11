import React from 'react'
import {
  Body, Container, Head, Heading, Html,
  Link, Preview, Section, Text, Button,
} from '@react-email/components'

interface ReportReadyEmailProps {
  fullName: string
  primaryRole: string
  secondaryRole: string
  rolePairTitle: string
}

export const ReportReadyEmail: React.FC<ReportReadyEmailProps> = ({
  fullName,
  primaryRole,
  secondaryRole,
  rolePairTitle,
}) => {
  const firstName = fullName?.split(' ')[0] ?? 'there'

  return (
    <Html>
      <Head />
      <Preview>Your Change Genius™ Report is ready — {rolePairTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            <Text style={logo}>Change Genius™</Text>
          </Section>

          <Heading style={h1}>Your Report is Ready, {firstName}</Heading>

         <Text style={paragraph}>
            You have completed the Change Genius™ Assessment. Your full report is attached to this email as a PDF — open or download it to view your results.
            </Text>

          <Section style={resultsBox}>
            <Text style={resultLabel}>YOUR CHANGE GENIUS™</Text>
            <Text style={resultValue}>{primaryRole} + {secondaryRole}</Text>
            <Text style={resultLabel}>ROLE PAIRING</Text>
            <Text style={resultValue}>{rolePairTitle}</Text>
          </Section>

          <Text style={paragraph}>
            Your attached report includes your full ADAPTS™ profile, energy breakdown, entrepreneur application, and 30-day action plan.
          </Text>

          <Section style={{ textAlign: 'center' as const, marginBottom: '24px' }}>
            <Button style={button} href="https://changegeniusai.com">
              Visit Change Genius™
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
const logo = { fontSize: '24px', fontWeight: 'bold', color: '#5469d4', textAlign: 'center' as const }
const h1 = { color: '#000', fontSize: '24px', fontWeight: 500, lineHeight: '28px', marginBottom: '16px', textAlign: 'center' as const }
const resultsBox = { background: '#f5f4f5', borderRadius: '8px', padding: '24px', marginBottom: '24px' }
const resultLabel = { fontSize: '10px', color: '#888', letterSpacing: '0.08em', margin: '0 0 2px' }
const resultValue = { fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 12px' }
const paragraph = { color: '#000', fontSize: '14px', lineHeight: '23px', marginBottom: '16px' }
const button = { backgroundColor: '#5469d4', borderRadius: '4px', color: '#fff', fontSize: '16px', fontWeight: 'bold', lineHeight: '50px', textAlign: 'center' as const, textDecoration: 'none', width: '200px', display: 'block', margin: '0 auto' }
const link = { color: '#5469d4', textDecoration: 'underline' }
const footer = { color: '#898989', fontSize: '12px', lineHeight: '22px', marginTop: '32px' }