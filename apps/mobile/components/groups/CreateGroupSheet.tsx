import { useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { colors, spacing, borderRadius, shadows } from "@/constants/theme";
import { X } from "lucide-react-native";
import { useGroupsService } from "@/lib/groups-service";
import type { CreateGroupInput } from "@/types/groups";

interface CreateGroupSheetProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (groupId: string) => void;
}

export function CreateGroupSheet({
  visible,
  onClose,
  onSuccess,
}: CreateGroupSheetProps) {
  const groupsService = useGroupsService();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [emoji, setEmoji] = useState("👥");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Group name is required");
      return;
    }

    setIsLoading(true);
    try {
      const data: CreateGroupInput = {
        name: name.trim(),
        description: description.trim() || null,
        emoji: emoji.trim() || "👥",
      };

      const response = await groupsService.createGroup(data);
      setName("");
      setDescription("");
      setEmoji("👥");
      onClose();
      onSuccess(response.group.id);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create group";
      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setName("");
      setDescription("");
      setEmoji("👥");
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
          keyboardVerticalOffset={0}
        >
          <View style={styles.sheetContainer}>
            <Pressable onPress={(e) => e.stopPropagation()} style={styles.sheet}>
              <SafeAreaView edges={["bottom"]} style={styles.sheetContent}>
                <View style={styles.header}>
                  <Text variant="h2" color="foreground">
                    Create New Group
                  </Text>
                  <Pressable
                    onPress={handleClose}
                    accessibilityLabel="Close"
                    accessibilityRole="button"
                    disabled={isLoading}
                  >
                    <X size={24} color={colors.foreground} />
                  </Pressable>
                </View>
                <Text variant="body" color="muted" style={styles.description}>
                  Create a group to split bills with others. You&apos;ll be added
                  as an admin automatically.
                </Text>
                <ScrollView
                  style={styles.content}
                  contentContainerStyle={styles.contentContainer}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  nestedScrollEnabled
                >
                <View style={styles.emojiRow}>
                  <View style={styles.emojiContainer}>
                    <Input
                      label="Emoji"
                      value={emoji}
                      onChangeText={setEmoji}
                      placeholder="👥"
                      maxLength={10}
                      editable={!isLoading}
                      style={styles.emojiInput}
                    />
                  </View>
                  <View style={styles.nameContainer}>
                    <Input
                      label="Group Name *"
                      value={name}
                      onChangeText={setName}
                      placeholder="e.g., Roommates, Family Trip"
                      maxLength={100}
                      editable={!isLoading}
                      autoFocus
                    />
                  </View>
                </View>
                <Input
                  label="Description (optional)"
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Add a description for this group..."
                  maxLength={500}
                  multiline
                  numberOfLines={3}
                  editable={!isLoading}
                  style={styles.descriptionInput}
                />
              </ScrollView>
              <View style={styles.actions}>
                <Button
                  variant="outline"
                  onPress={handleClose}
                  disabled={isLoading}
                  style={styles.cancelButton}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onPress={handleSubmit}
                  disabled={isLoading || !name.trim()}
                  style={styles.createButton}
                >
                  {isLoading ? "Creating..." : "Create Group"}
                </Button>
              </View>
              </SafeAreaView>
            </Pressable>
          </View>
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
  sheetContainer: {
    maxHeight: "90%",
    width: "100%",
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: borderRadius["2xl"], // Refined from 3xl
    borderTopRightRadius: borderRadius["2xl"],
    ...shadows.lg,
  },
  sheetContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
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
    marginBottom: spacing.lg,
  },
  contentContainer: {
    paddingBottom: spacing.sm,
  },
  emojiRow: {
    flexDirection: "row",
    marginBottom: spacing.sm,
  },
  emojiContainer: {
    width: 100,
    marginRight: spacing.md,
  },
  emojiInput: {
    textAlign: "center",
    fontSize: 24,
  },
  nameContainer: {
    flex: 1,
  },
  descriptionInput: {
    minHeight: 80,
    textAlignVertical: "top",
    paddingTop: spacing.md,
  },
  actions: {
    flexDirection: "row",
    paddingBottom: spacing.lg,
  },
  cancelButton: {
    flex: 1,
    marginRight: spacing.md / 2,
  },
  createButton: {
    flex: 1,
    marginLeft: spacing.md / 2,
  },
});
