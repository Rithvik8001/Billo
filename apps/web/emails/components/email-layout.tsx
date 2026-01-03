import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
} from "@react-email/components";
import * as React from "react";

interface EmailLayoutProps {
  children: React.ReactNode;
  previewText: string;
  unsubscribeUrl?: string;
}

export function EmailLayout({
  children,
  previewText,
  unsubscribeUrl,
}: EmailLayoutProps) {
  return (
    <Html>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="x-apple-disable-message-reformatting" />
      </Head>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Billo Header */}
          <Section style={headerStyle}>
            <Text style={logoStyle}>Billo</Text>
            <Text style={taglineStyle}>Split bills, not friendships</Text>
          </Section>

          {/* Main Content */}
          <Section style={contentStyle}>{children}</Section>

          {/* Footer */}
          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              Sent by Billo - Your bill splitting companion
            </Text>
            {unsubscribeUrl && (
              <Link href={unsubscribeUrl} style={unsubscribeLinkStyle}>
                Unsubscribe from this type of email
              </Link>
            )}
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Inline styles for email compatibility
const bodyStyle: React.CSSProperties = {
  backgroundColor: "#F4EDEB",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  padding: "40px 20px",
};

const containerStyle: React.CSSProperties = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const headerStyle: React.CSSProperties = {
  backgroundColor: "#F97316",
  padding: "32px 40px",
  textAlign: "center" as const,
};

const logoStyle: React.CSSProperties = {
  fontSize: "32px",
  fontWeight: "bold",
  color: "#ffffff",
  margin: "0 0 8px 0",
};

const taglineStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "rgba(255, 255, 255, 0.9)",
  margin: "0",
};

const contentStyle: React.CSSProperties = {
  padding: "40px",
};

const footerStyle: React.CSSProperties = {
  backgroundColor: "#f9fafb",
  padding: "24px 40px",
  textAlign: "center" as const,
  borderTop: "1px solid #e5e7eb",
};

const footerTextStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "#6b7280",
  margin: "0 0 8px 0",
};

const unsubscribeLinkStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "#F97316",
  textDecoration: "none",
};
