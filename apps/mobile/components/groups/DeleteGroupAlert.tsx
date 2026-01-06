import { Modal, View, StyleSheet, Pressable } from "react-native";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { colors, spacing, borderRadius, shadows } from "@/constants/theme";

interface DeleteGroupAlertProps {
  visible: boolean;
  groupName: string;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export function DeleteGroupAlert({
  visible,
  groupName,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteGroupAlertProps) {
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
              Delete Group
            </Text>
            <Text variant="body" color="muted" style={styles.description}>
              Are you sure you want to delete &quot;{groupName}&quot;? This
              action cannot be undone and will remove all members from this
              group.
            </Text>
            <View style={styles.actions}>
              <Button
                variant="outline"
                onPress={onClose}
                disabled={isDeleting}
                style={styles.cancelButton}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onPress={onConfirm}
                disabled={isDeleting}
                style={styles.confirmButton}
              >
                {isDeleting ? "Deleting..." : "Delete"}
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
  },
  cancelButton: {
    flex: 1,
    marginRight: spacing.sm,
  },
  confirmButton: {
    flex: 1,
    marginLeft: spacing.sm,
  },
});
