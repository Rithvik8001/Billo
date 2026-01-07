import { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { colors, spacing, borderRadius, shadows } from "@/constants/theme";
import { X, Check } from "lucide-react-native";
import { useCurrency } from "@/hooks/useCurrency";
import { SUPPORTED_CURRENCIES } from "@/lib/currency";

interface CurrencySheetProps {
  visible: boolean;
  onClose: () => void;
}

export function CurrencySheet({ visible, onClose }: CurrencySheetProps) {
  const { currency, setCurrency, formatAmount } = useCurrency();
  const [selectedCurrency, setSelectedCurrency] = useState(currency);

  useEffect(() => {
    if (visible) {
      setSelectedCurrency(currency);
    }
  }, [visible, currency]);

  const handleSave = async () => {
    if (selectedCurrency !== currency) {
      try {
        await setCurrency(selectedCurrency);
      } catch (error) {
        console.error("Error updating currency:", error);
      }
    }
    onClose();
  };

  const renderCurrencyItem = ({ item }: { item: typeof SUPPORTED_CURRENCIES[0] }) => {
    const isSelected = item.code === selectedCurrency;

    return (
      <Pressable
        onPress={() => setSelectedCurrency(item.code)}
        style={styles.currencyItem}
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected }}
      >
        <View style={styles.currencyInfo}>
          <Text variant="bodyLarge" color="foreground" style={styles.currencySymbol}>
            {item.symbol}
          </Text>
          <View style={styles.currencyDetails}>
            <Text variant="body" color="foreground">
              {item.name}
            </Text>
            <Text variant="small" color="muted">
              {item.code}
            </Text>
          </View>
        </View>
        {isSelected && <Check size={20} color={colors.primary} />}
      </Pressable>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <SafeAreaView edges={["bottom"]} style={styles.sheet}>
            <View style={styles.header}>
              <Text variant="h2" color="foreground">
                Select Currency
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
              Choose your preferred currency for displaying amounts
            </Text>

            <FlatList
              data={SUPPORTED_CURRENCIES}
              renderItem={renderCurrencyItem}
              keyExtractor={(item) => item.code}
              style={styles.list}
              showsVerticalScrollIndicator={false}
            />

            <View style={styles.preview}>
              <Text variant="small" color="muted" style={styles.previewLabel}>
                Preview:
              </Text>
              <Text variant="bodyLarge" color="foreground" style={styles.previewAmount}>
                {formatAmount(1234.56)}
              </Text>
            </View>

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
                disabled={selectedCurrency === currency}
                style={styles.saveButton}
              >
                Save Changes
              </Button>
            </View>
          </SafeAreaView>
        </Pressable>
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
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: borderRadius["2xl"], // Refined from 3xl
    borderTopRightRadius: borderRadius["2xl"],
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
  list: {
    flex: 1,
    marginBottom: spacing.md,
  },
  currencyItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.xs,
  },
  currencyInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    flex: 1,
  },
  currencySymbol: {
    width: 40,
    textAlign: "center",
    fontWeight: "600",
  },
  currencyDetails: {
    flex: 1,
  },
  preview: {
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginBottom: spacing.md,
  },
  previewLabel: {
    marginBottom: spacing.xs,
  },
  previewAmount: {
    fontWeight: "600",
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

