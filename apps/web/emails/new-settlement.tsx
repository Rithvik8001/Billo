import { Text, Heading, Hr } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/email-layout";
import { Button } from "./components/button";

interface NewSettlementEmailProps {
  recipientName: string;
  amount: string;
  currency: string;
  merchantName: string;
  isOwed: boolean; // true if user is owed, false if user owes
  otherPersonName: string;
  groupName?: string;
  settlementUrl: string;
  unsubscribeUrl: string;
}

export function NewSettlementEmail({
  recipientName,
  amount,
  currency,
  merchantName,
  isOwed,
  otherPersonName,
  groupName,
  settlementUrl,
  unsubscribeUrl,
}: NewSettlementEmailProps) {
  const subject = isOwed ? `You're owed ${amount}` : `You owe ${amount}`;
  const emoji = isOwed ? "💰" : "💸";

  return (
    <EmailLayout previewText={subject} unsubscribeUrl={unsubscribeUrl}>
      <Heading style={headingStyle}>
        {emoji} {subject}
      </Heading>
      <Text style={textStyle}>Hi {recipientName},</Text>
      {isOwed ? (
        <Text style={textStyle}>
          <strong>{otherPersonName}</strong> owes you <strong>{amount}</strong>{" "}
          for <strong>{merchantName}</strong>.
        </Text>
      ) : (
        <Text style={textStyle}>
          You owe <strong>{otherPersonName}</strong> <strong>{amount}</strong>{" "}
          for <strong>{merchantName}</strong>.
        </Text>
      )}
      {groupName && (
        <>
          <Hr style={hrStyle} />
          <Text style={metaTextStyle}>Group: {groupName}</Text>
        </>
      )}
      <Button href={settlementUrl}>View Settlement</Button>
    </EmailLayout>
  );
}

export default NewSettlementEmail;

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
  margin: "0 0 8px 0",
};
