import { Text, Heading, Hr } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/email-layout";

interface SettlementUnmarkedEmailProps {
  recipientName: string;
  amount: string;
  otherPersonName: string;
  merchantName: string;
  isPayer: boolean; // true if user is payer (fromUser), false if user is receiver
  unsubscribeUrl: string;
}

export function SettlementUnmarkedEmail({
  recipientName,
  amount,
  otherPersonName,
  merchantName,
  isPayer,
  unsubscribeUrl,
}: SettlementUnmarkedEmailProps) {
  return (
    <EmailLayout previewText="Payment unmarked" unsubscribeUrl={unsubscribeUrl}>
      <Heading style={headingStyle}>Payment Unmarked ⚠️</Heading>
      <Text style={textStyle}>Hi {recipientName},</Text>
      {isPayer ? (
        <Text style={textStyle}>
          The payment of <strong>{amount}</strong> to{" "}
          <strong>{otherPersonName}</strong> for <strong>{merchantName}</strong>{" "}
          has been marked as unpaid. This settlement is now pending again.
        </Text>
      ) : (
        <Text style={textStyle}>
          <strong>{otherPersonName}</strong> has marked their payment of{" "}
          <strong>{amount}</strong> for <strong>{merchantName}</strong> as
          unpaid. This settlement is now pending again.
        </Text>
      )}
      <Hr style={hrStyle} />
      <Text style={metaTextStyle}>
        You can view and manage your settlements in the Settle Up page.
      </Text>
    </EmailLayout>
  );
}

export default SettlementUnmarkedEmail;

const headingStyle: React.CSSProperties = {
  fontSize: "28px",
  fontWeight: "600",
  color: "#111827",
  margin: "0 0 24px 0",
  lineHeight: "36px",
  letterSpacing: "-0.01em",
};

const textStyle: React.CSSProperties = {
  fontSize: "15px",
  color: "#374151",
  lineHeight: "24px",
  margin: "0 0 16px 0",
};

const hrStyle: React.CSSProperties = {
  border: "none",
  borderTop: "1px solid #e5e7eb",
  margin: "24px 0",
};

const metaTextStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#6b7280",
  margin: "0",
  lineHeight: "20px",
};
