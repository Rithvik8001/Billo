import { useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { colors, spacing, borderRadius, shadows } from "@/constants/theme";
import { X } from "lucide-react-native";

interface ManualEntrySheetProps {
  visible: boolean;
  onClose: () => void;
}

export function ManualEntrySheet({
  visible,
  onClose,
}: ManualEntrySheetProps) {
  const [merchantName, setMerchantName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");

  const handleSave = () => {
    // Placeholder - will implement later
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <SafeAreaView
              edges={["bottom"]}
              style={styles.sheet}
            >
              <View style={styles.header}>
                <Text variant="h2" color="foreground">
                  Add Expense
                </Text>
                <Pressable
                  onPress={onClose}
                  accessibilityLabel="Close"
                  accessibilityRole="button"
                >
                  <X size={24} color={colors.foreground} />
                </Pressable>
              </View>
              <Text variant="body" color="muted" style={styles.description}>
                Manually enter receipt details
              </Text>
              <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
              >
                <Input
                  label="Merchant Name"
                  value={merchantName}
                  onChangeText={setMerchantName}
                  placeholder="Enter merchant name"
                  editable={false}
                />
                <Input
                  label="Amount"
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="$0.00"
                  keyboardType="decimal-pad"
                  editable={false}
                />
                <Input
                  label="Date"
                  value={date}
                  onChangeText={setDate}
                  placeholder="Select date"
                  editable={false}
                />
                <Input
                  label="Category"
                  value={category}
                  onChangeText={setCategory}
                  placeholder="Select category"
                  editable={false}
                />
              </ScrollView>
              <View style={styles.actions}>
                <Button
                  variant="outline"
                  onPress={onClose}
                  style={styles.cancelButton}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onPress={handleSave}
                  disabled
                  style={styles.saveButton}
                >
                  Save
                </Button>
              </View>
            </SafeAreaView>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  keyboardView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: borderRadius["3xl"],
    borderTopRightRadius: borderRadius["3xl"],
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    maxHeight: "90%",
    ...shadows.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  description: {
    marginBottom: spacing.lg,
  },
  content: {
    flex: 1,
    marginBottom: spacing.lg,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.md,
    paddingBottom: spacing.lg,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
});

