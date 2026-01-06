import { Modal, View, StyleSheet, Pressable } from "react-native";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { colors, spacing, borderRadius, shadows } from "@/constants/theme";

interface DeleteMemberAlertProps {
  visible: boolean;
  memberName: string;
  onClose: () => void;
  onConfirm: () => void;
  isRemoving: boolean;
}

export function DeleteMemberAlert({
  visible,
  memberName,
  onClose,
  onConfirm,
  isRemoving,
}: DeleteMemberAlertProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View style={styles.alert}>
            <Text variant="h3" color="foreground" style={styles.title}>
              Remove Member
            </Text>
            <Text variant="body" color="muted" style={styles.description}>
              Are you sure you want to remove {memberName} from this group? This
              action cannot be undone.
            </Text>
            <View style={styles.actions}>
              <Button
                variant="outline"
                onPress={onClose}
                disabled={isRemoving}
                style={styles.cancelButton}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onPress={onConfirm}
                disabled={isRemoving}
                style={styles.confirmButton}
              >
                {isRemoving ? "Removing..." : "Remove"}
              </Button>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  alert: {
    backgroundColor: colors.card,
    borderRadius: borderRadius["2xl"],
    padding: spacing.lg,
    width: "100%",
    maxWidth: 400,
    ...shadows.lg,
  },
  title: {
    marginBottom: spacing.sm,
  },
  description: {
    marginBottom: spacing.lg,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
  },
  confirmButton: {
    flex: 1,
  },
});
