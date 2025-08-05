import React from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ModalWrapperProps {
  visible: boolean;
  title?: string;
  onClose: () => void;
  onSave?: () => void;
  saveText?: string;
  cancelText?: string;
  loading?: boolean;
  saveDisabled?: boolean;
  children: React.ReactNode;
  showSaveButton?: boolean;
  scrollable?: boolean;
  showHeader?: boolean;
  fullScreen?: boolean;
}

export default function ModalWrapper({
  visible,
  title = "",
  onClose,
  onSave,
  saveText = "Save",
  cancelText = "Cancel",
  loading = false,
  saveDisabled = false,
  children,
  showSaveButton = true,
  scrollable = true,
  showHeader = true,
  fullScreen = false,
}: ModalWrapperProps) {
  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  const handleSave = () => {
    if (loading || saveDisabled || !onSave) return;
    onSave();
  };

  const ContentWrapper = scrollable ? ScrollView : View;
  const contentProps = scrollable
    ? {
        className: "flex-1",
        contentContainerStyle: { padding: 20 },
        keyboardShouldPersistTaps: "handled" as const,
      }
    : {
        className: "flex-1 p-5",
      };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle={fullScreen ? "fullScreen" : "pageSheet"}
      onRequestClose={handleClose}
    >
      <SafeAreaView className="flex-1 bg-gray-50">
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {/* Header */}
          {showHeader && (
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
              <TouchableOpacity onPress={handleClose} disabled={loading}>
                <Text className="text-base text-blue-500">
                  {cancelText}
                </Text>
              </TouchableOpacity>

              <Text className="text-lg font-semibold text-gray-800">
                {title}
              </Text>

              {showSaveButton ? (
                <TouchableOpacity
                  onPress={handleSave}
                  disabled={loading || saveDisabled}
                  className={`px-3 py-1 rounded-lg ${
                    loading || saveDisabled ? "bg-gray-200" : "bg-blue-500"
                  }`}
                >
                  <Text
                    className={`text-base font-semibold ${
                      loading || saveDisabled ? "text-gray-400" : "text-white"
                    }`}
                  >
                    {loading ? "Saving..." : saveText}
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={{ width: 50 }} />
              )}
            </View>
          )}

          {/* Content */}
          <ContentWrapper {...contentProps}>{children}</ContentWrapper>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}
