import { ReactNode } from "react";
import { ScrollView, Text, View } from "react-native";
import { theme } from "../../theme";

export type AuthLayoutProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={{
        padding: 24,
        gap: 24,
      }}
    >
      <View style={{ gap: 8 }}>
        <Text
          selectable
          style={{
            fontFamily: theme.typography.fontFamily.semibold,
            fontSize: theme.typography.size.title,
            color: theme.colors.foreground,
          }}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            selectable
            style={{
              fontFamily: theme.typography.fontFamily.regular,
              fontSize: theme.typography.size.small,
              color: theme.colors.muted,
            }}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>

      {children}

      {footer ? <View style={{ marginTop: 8 }}>{footer}</View> : null}
    </ScrollView>
  );
}
