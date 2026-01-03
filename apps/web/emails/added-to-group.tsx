import { Text, Heading } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/email-layout";
import { Button } from "./components/button";

interface AddedToGroupEmailProps {
  memberName: string;
  groupName: string;
  groupEmoji: string;
  addedByName: string;
  groupUrl: string;
  unsubscribeUrl: string;
}

export function AddedToGroupEmail({
  memberName,
  groupName,
  groupEmoji,
  addedByName,
  groupUrl,
  unsubscribeUrl,
}: AddedToGroupEmailProps) {
  return (
    <EmailLayout
      previewText={`You've been added to ${groupName}`}
      unsubscribeUrl={unsubscribeUrl}
    >
      <Heading style={headingStyle}>
        Welcome to {groupEmoji} {groupName}!
      </Heading>
      <Text style={textStyle}>Hi {memberName},</Text>
      <Text style={textStyle}>
        <strong>{addedByName}</strong> has added you to the group "
        <strong>{groupName}</strong>".
      </Text>
      <Text style={textStyle}>
        You can now split bills with your group members and keep track of who
        owes what.
      </Text>
      <Button href={groupUrl}>View Group</Button>
    </EmailLayout>
  );
}

export default AddedToGroupEmail;

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
