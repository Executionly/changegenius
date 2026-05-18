import React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Link,
} from '@react-email/components'

interface ContactUsEmailProps {
  name: string
  email: string
  inquiryType: string
  organization?: string
  message: string
}

export const ContactUsEmail: React.FC<ContactUsEmailProps> = ({
  name,
  email,
  inquiryType,
  message,
  organization
}) => {
  return (
    <Html>
      <Head />
      <Preview>New contact message from {name}</Preview>

      <Body style={main}>
        <Container style={container}>
          
          <Section style={logoContainer}>
            <Text style={logo}>Change Genius™</Text>
          </Section>

          <Heading style={h1}>New Contact Message</Heading>

          <Text style={meta}>
            You received a new message from your website contact form.
          </Text>

          <Section style={box}>
            <Text style={label}>Name</Text>
            <Text style={value}>{name}</Text>
            <Text style={label}>Organization</Text>
            <Text style={value}>{organization}</Text>

            <Text style={label}>Email</Text>
            <Text>
              <Link href={`mailto:${email}`} style={link}>
                {email}
              </Link>
            </Text>

            <Text style={label}>Inquiry Type</Text>
            <Text style={value}>{inquiryType}</Text>

            <Text style={label}>Message</Text>
            <Text style={messageBox}>{message}</Text>
          </Section>

          <Text style={footer}>
            This message was sent from the Contact Us form on Change Genius™
          </Text>

        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'Helvetica, Arial, sans-serif',
}

const container = {
  margin: '40px auto',
  padding: '24px',
  width: '520px',
  border: '1px solid #eee',
  borderRadius: '10px',
  backgroundColor: '#fff',
}

const logoContainer = {
  textAlign: 'center' as const,
  marginBottom: '24px',
}

const logo = {
  fontSize: '20px',
  fontWeight: 700,
  color: '#5469d4',
}

const h1 = {
  fontSize: '22px',
  fontWeight: 600,
  marginBottom: '12px',
  textAlign: 'center' as const,
}

const meta = {
  fontSize: '14px',
  color: '#666',
  marginBottom: '20px',
  textAlign: 'center' as const,
}

const box = {
  backgroundColor: '#f7f7f7',
  padding: '18px',
  borderRadius: '8px',
}

const label = {
  fontSize: '12px',
  fontWeight: 700,
  color: '#888',
  marginTop: '12px',
}

const value = {
  fontSize: '14px',
  color: '#111',
}

const messageBox = {
  fontSize: '14px',
  color: '#111',
  whiteSpace: 'pre-wrap',
  marginTop: '6px',
}

const link = {
  color: '#5469d4',
  textDecoration: 'underline',
}

const footer = {
  marginTop: '24px',
  fontSize: '12px',
  color: '#999',
  textAlign: 'center' as const,
}