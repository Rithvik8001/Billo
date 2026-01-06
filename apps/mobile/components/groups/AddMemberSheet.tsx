import { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { colors, spacing, borderRadius, shadows } from "@/constants/theme";
import { X } from "lucide-react-native";
import { useGroupsService } from "@/lib/groups-service";
import type { SearchUser } from "@/types/groups";
import { Image } from "expo-image";

interface AddMemberSheetProps {
  visible: boolean;
  onClose: () => void;
  groupId: string;
  onSuccess: () => void;
}

export function AddMemberSheet({
  visible,
  onClose,
  groupId,
  onSuccess,
}: AddMemberSheetProps) {
  const groupsService = useGroupsService();
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<SearchUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<SearchUser | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible) {
      setSearchQuery("");
      setSelectedUser(null);
      setUsers([]);
    }
  }, [visible]);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!searchQuery.trim() || searchQuery.length < 2) {
      setUsers([]);
      return;
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const searchUsers = async (query: string) => {
    setIsSearching(true);
    try {
      const response = await groupsService.searchUsers(query);
      setUsers(response.users || []);
    } catch (error) {
      console.error("Error searching users:", error);
      setUsers([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectUser = (user: SearchUser) => {
    setSelectedUser(user);
    setSearchQuery("");
    setUsers([]);
  };

  const handleAddMember = async () => {
    if (!selectedUser) {
      Alert.alert("Error", "Please select a user");
      return;
    }

    setIsAdding(true);
    try {
      await groupsService.addMember(groupId, selectedUser.id);
      setSelectedUser(null);
      setSearchQuery("");
      setUsers([]);
      onClose();
      onSuccess();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add member";
      Alert.alert("Error", errorMessage);
    } finally {
      setIsAdding(false);
    }
  };

  const handleClose = () => {
    if (!isAdding) {
      setSelectedUser(null);
      setSearchQuery("");
      setUsers([]);
      onClose();
    }
  };

  const renderUserItem = ({ item }: { item: SearchUser }) => (
    <Pressable
      style={styles.userItem}
      onPress={() => handleSelectUser(item)}
      accessibilityRole="button"
    >
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.userAvatar} />
      ) : (
        <View style={styles.userAvatarPlaceholder}>
          <Text variant="small" color="muted">
            {item.email[0].toUpperCase()}
          </Text>
        </View>
      )}
      <View style={styles.userInfo}>
        <Text variant="body" color="foreground" style={styles.userName}>
          {item.name || item.email.split("@")[0]}
        </Text>
        <Text variant="small" color="muted" style={styles.userEmail}>
          {item.email}
        </Text>
      </View>
    </Pressable>
  );

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
        >
          <View style={styles.sheetContainer}>
            <Pressable onPress={(e) => e.stopPropagation()} style={styles.sheet}>
              <SafeAreaView edges={["bottom"]} style={styles.sheetContent}>
                <View style={styles.header}>
                  <Text variant="h2" color="foreground">
                    Add Member
                  </Text>
                  <Pressable
                    onPress={handleClose}
                    accessibilityLabel="Close"
                    accessibilityRole="button"
                    disabled={isAdding}
                  >
                    <X size={24} color={colors.foreground} />
                  </Pressable>
                </View>
                <Text variant="body" color="muted" style={styles.description}>
                  Search for a user by email to add them to this group.
                </Text>
                <ScrollView
                  style={styles.content}
                  contentContainerStyle={styles.contentContainer}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  nestedScrollEnabled
                >
                <View style={styles.searchContainer}>
                  <Input
                    label="Search by Email"
                    value={searchQuery}
                    onChangeText={(text) => {
                      setSearchQuery(text);
                      if (selectedUser) {
                        setSelectedUser(null);
                      }
                    }}
                    placeholder="Type email to search..."
                    editable={!isAdding}
                    autoFocus
                  />
                  {searchQuery && !selectedUser && (
                    <View style={styles.searchResults}>
                      {isSearching ? (
                        <View style={styles.searchResultItem}>
                          <Text variant="body" color="muted">
                            Searching...
                          </Text>
                        </View>
                      ) : users.length === 0 && searchQuery.length >= 2 ? (
                        <View style={styles.searchResultItem}>
                          <Text variant="body" color="muted">
                            No users found
                          </Text>
                        </View>
                      ) : (
                        <FlatList
                          data={users}
                          renderItem={renderUserItem}
                          keyExtractor={(item) => item.id}
                          scrollEnabled={false}
                        />
                      )}
                    </View>
                  )}
                </View>

                {selectedUser && (
                  <View style={styles.selectedUser}>
                    <Text
                      variant="body"
                      color="foreground"
                      style={styles.selectedLabel}
                    >
                      Selected:
                    </Text>
                    <View style={styles.selectedUserInfo}>
                      {selectedUser.imageUrl ? (
                        <Image
                          source={{ uri: selectedUser.imageUrl }}
                          style={styles.selectedAvatar}
                        />
                      ) : (
                        <View style={styles.selectedAvatarPlaceholder}>
                          <Text variant="body" color="muted">
                            {selectedUser.email[0].toUpperCase()}
                          </Text>
                        </View>
                      )}
                      <View style={styles.selectedUserDetails}>
                        <Text
                          variant="body"
                          color="foreground"
                          style={styles.selectedUserName}
                        >
                          {selectedUser.name ||
                            selectedUser.email.split("@")[0]}
                        </Text>
                        <Text variant="small" color="muted">
                          {selectedUser.email}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              </ScrollView>
              <View style={styles.actions}>
                <Button
                  variant="outline"
                  onPress={handleClose}
                  disabled={isAdding}
                  style={styles.cancelButton}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onPress={handleAddMember}
                  disabled={!selectedUser || isAdding}
                  style={styles.addButton}
                >
                  {isAdding ? "Adding..." : "Add Member"}
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
    borderTopLeftRadius: borderRadius["2xl"],
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
  searchContainer: {
    marginBottom: spacing.md,
  },
  searchResults: {
    marginTop: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    maxHeight: 200,
    overflow: "hidden",
  },
  searchResultItem: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  userAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.muted,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  userInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  userName: {
    fontWeight: "500",
    marginBottom: spacing.xs / 2,
  },
  userEmail: {
    fontSize: 12,
  },
  selectedUser: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.muted,
  },
  selectedLabel: {
    fontWeight: "500",
    marginBottom: spacing.sm,
  },
  selectedUserInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectedAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.md,
  },
  selectedAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.muted,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  selectedUserDetails: {
    flex: 1,
  },
  selectedUserName: {
    fontWeight: "500",
    marginBottom: spacing.xs / 2,
  },
  actions: {
    flexDirection: "row",
    paddingBottom: spacing.lg,
  },
  cancelButton: {
    flex: 1,
    marginRight: spacing.sm,
  },
  addButton: {
    flex: 1,
    marginLeft: spacing.sm,
  },
});
