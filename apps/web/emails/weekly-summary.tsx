import { Text, Heading, Hr, Section } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/email-layout";
import { Button } from "./components/button";

interface WeeklySummaryEmailProps {
  userName: string;
  totalYouOwe: string;
  totalOwedToYou: string;
  netBalance: string;
  pendingSettlements: Array<{
    id: number;
    otherPersonName: string;
    amount: string;
    merchantName: string;
    type: "owe" | "owed";
  }>;
  dashboardUrl: string;
  unsubscribeUrl: string;
}

export function WeeklySummaryEmail({
  userName,
  totalYouOwe,
  totalOwedToYou,
  netBalance,
  pendingSettlements,
  dashboardUrl,
  unsubscribeUrl,
}: WeeklySummaryEmailProps) {
  return (
    <EmailLayout
      previewText="Your weekly Billo summary"
      unsubscribeUrl={unsubscribeUrl}
    >
      <Heading style={headingStyle}>Weekly Summary 📊</Heading>
      <Text style={textStyle}>Hi {userName},</Text>
      <Text style={textStyle}>Here's your weekly expense summary:</Text>

      {/* Balance Cards */}
      <Section style={balanceContainerStyle}>
        <Section style={balanceCardStyle}>
          <Text style={balanceLabelStyle}>You Owe</Text>
          <Text style={balanceAmountStyle}>{totalYouOwe}</Text>
        </Section>
        <Section style={balanceCardStyle}>
          <Text style={balanceLabelStyle}>You're Owed</Text>
          <Text style={balanceAmountStyle}>{totalOwedToYou}</Text>
        </Section>
        <Section style={balanceCardStyle}>
          <Text style={balanceLabelStyle}>Net Balance</Text>
          <Text style={balanceAmountStyle}>{netBalance}</Text>
        </Section>
      </Section>

      {/* Pending Settlements */}
      {pendingSettlements.length > 0 && (
        <>
          <Hr style={hrStyle} />
          <Text style={sectionHeadingStyle}>Pending Settlements:</Text>
          {pendingSettlements.slice(0, 5).map((s) => (
            <Text key={s.id} style={settlementItemStyle}>
              {s.type === "owe" ? "↑" : "↓"} <strong>{s.amount}</strong> -{" "}
              {s.otherPersonName} ({s.merchantName})
            </Text>
          ))}
          {pendingSettlements.length > 5 && (
            <Text style={moreTextStyle}>
              +{pendingSettlements.length - 5} more settlements
            </Text>
          )}
        </>
      )}

      <Button href={dashboardUrl}>View Dashboard</Button>
    </EmailLayout>
  );
}

export default WeeklySummaryEmail;

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

const balanceContainerStyle: React.CSSProperties = {
  display: "flex",
  gap: "16px",
  margin: "24px 0",
};

const balanceCardStyle: React.CSSProperties = {
  flex: "1",
  backgroundColor: "#f9fafb",
  padding: "16px",
  borderRadius: "8px",
  textAlign: "center" as const,
};

const balanceLabelStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "#6b7280",
  textTransform: "uppercase" as const,
  margin: "0 0 8px 0",
};

const balanceAmountStyle: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: "bold",
  color: "#111827",
  margin: "0",
};

const hrStyle: React.CSSProperties = {
  border: "none",
  borderTop: "1px solid #e5e7eb",
  margin: "24px 0",
};

const sectionHeadingStyle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#111827",
  margin: "0 0 12px 0",
};

const settlementItemStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#374151",
  margin: "0 0 8px 0",
  padding: "8px 0",
  borderBottom: "1px solid #f3f4f6",
};

const moreTextStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#6b7280",
  fontStyle: "italic" as const,
  margin: "12px 0 0 0",
};
