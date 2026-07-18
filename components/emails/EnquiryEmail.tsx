import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface EnquiryEmailProps {
  name: string;
  company?: string;
  contact: string;
  eventType?: string;
  message?: string;
}

export const EnquiryEmail = ({
  name,
  company,
  contact,
  eventType,
  message,
}: EnquiryEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>New Nova Enquiry from {name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>NOVA EVENTS</Heading>
          <Text style={subheading}>New Enquiry Received</Text>
          
          <Section style={detailsContainer}>
            <Text style={field}>
              <span style={label}>NAME:</span> {name}
            </Text>
            {company && (
              <Text style={field}>
                <span style={label}>COMPANY:</span> {company}
              </Text>
            )}
            <Text style={field}>
              <span style={label}>CONTACT:</span> {contact}
            </Text>
            {eventType && (
              <Text style={field}>
                <span style={label}>EVENT TYPE:</span> {eventType}
              </Text>
            )}
            {message && (
              <div style={messageBox}>
                <Text style={label}>MESSAGE:</Text>
                <Text style={messageText}>{message}</Text>
              </div>
            )}
          </Section>
          
          <Text style={footer}>
            Automated message from novaeventsgroup.com
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#0A0A0A",
  fontFamily:
    "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif",
  padding: "40px 0",
};

const container = {
  margin: "0 auto",
  padding: "40px",
  backgroundColor: "#111111",
  border: "1px solid #333333",
  borderRadius: "8px",
  maxWidth: "600px",
};

const h1 = {
  color: "#FFFFFF",
  fontSize: "24px",
  fontWeight: "bold",
  letterSpacing: "4px",
  margin: "0 0 10px 0",
  padding: "0",
  textAlign: "center" as const,
};

const subheading = {
  color: "#888888",
  fontSize: "12px",
  letterSpacing: "2px",
  textTransform: "uppercase" as const,
  textAlign: "center" as const,
  margin: "0 0 40px 0",
};

const detailsContainer = {
  backgroundColor: "#1A1A1A",
  padding: "24px",
  borderRadius: "6px",
  border: "1px solid #222222",
};

const field = {
  color: "#FFFFFF",
  fontSize: "14px",
  margin: "0 0 16px 0",
  lineHeight: "1.5",
};

const label = {
  color: "#666666",
  fontSize: "12px",
  letterSpacing: "1px",
  marginRight: "8px",
};

const messageBox = {
  marginTop: "24px",
  paddingTop: "24px",
  borderTop: "1px solid #333333",
};

const messageText = {
  color: "#E0E0E0",
  fontSize: "14px",
  lineHeight: "1.6",
  marginTop: "12px",
};

const footer = {
  color: "#555555",
  fontSize: "11px",
  letterSpacing: "1px",
  textAlign: "center" as const,
  marginTop: "40px",
  textTransform: "uppercase" as const,
};

export default EnquiryEmail;
