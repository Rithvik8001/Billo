import { Text, Heading, Hr } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/email-layout";

interface SettlementPaidEmailProps {
  recipientName: string;
  amount: string;
  otherPersonName: string;
  merchantName: string;
  isReceiver: boolean; // true if user received payment, false if user paid
  settledAt: string;
  unsubscribeUrl: string;
}

export function SettlementPaidEmail({
  recipientName,
  amount,
  otherPersonName,
  merchantName,
  isReceiver,
  settledAt,
  unsubscribeUrl,
}: SettlementPaidEmailProps) {
  return (
    <EmailLayout
      previewText="Payment confirmed"
      unsubscribeUrl={unsubscribeUrl}
    >
      <Heading style={headingStyle}>Payment Confirmed ✓</Heading>
      <Text style={textStyle}>Hi {recipientName},</Text>
      {isReceiver ? (
        <Text style={textStyle}>
          <strong>{otherPersonName}</strong> has marked their payment of{" "}
          <strong>{amount}</strong> as paid for <strong>{merchantName}</strong>.
        </Text>
      ) : (
        <Text style={textStyle}>
          Your payment of <strong>{amount}</strong> to{" "}
          <strong>{otherPersonName}</strong> for <strong>{merchantName}</strong>{" "}
          has been marked as paid.
        </Text>
      )}
      <Hr style={hrStyle} />
      <Text style={metaTextStyle}>Settled on {settledAt}</Text>
    </EmailLayout>
  );
}

export default SettlementPaidEmail;

const headingStyle: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#111827",
  margin: "0 0 24px 0",
};

const textStyle: React.CSSProperties = {
  fontSize: "16px",
  color: "#374151",
  lineHeight: "1.6",
  margin: "0 0 16px 0",
};

const hrStyle: React.CSSProperties = {
  border: "none",
  borderTop: "1px solid #e5e7eb",
  margin: "24px 0",
};

const metaTextStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#6b7280",
  margin: "0",
};
