import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

type ActionType = 'add' | 'update' | 'save_profile';

interface SaveButtonProps extends TouchableOpacityProps {
  isLoading?: boolean;
  loadingText?: string;
  actionType: ActionType;
  disabled?: boolean;
}

const SaveButton: React.FC<SaveButtonProps> = ({
  isLoading = false,
  loadingText,
  actionType,
  disabled = false,
  style,
  ...props
}) => {
  // Button will be disabled if either isLoading is true or disabled prop is true
  const isDisabled = isLoading || disabled;

  const getTitle = () => {
    if (isLoading) {
      return loadingText || getLoadingText();
    }
    return getButtonText();
  };

  const getLoadingText = () => {
    switch (actionType) {
      case 'add':
        return 'Adding...';
      case 'update':
        return 'Updating...';
      case 'save_profile':
        return 'Saving...';
      default:
        return 'Loading...';
    }
  };

  const getButtonText = () => {
    switch (actionType) {
      case 'add':
        return 'Add Transaction';
      case 'update':
        return 'Update Transaction';
      case 'save_profile':
        return 'Save Profile';
      default:
        return 'Save Changes';
    }
  };

  return (
    <TouchableOpacity
      disabled={isDisabled}
      className={`p-4 rounded-2xl ${
        isDisabled 
          ? 'bg-gray-200' 
          : 'bg-blue-500 active:bg-blue-600'
      }`}
      {...props}
    >
      <Text 
        className={`text-center font-semibold text-base ${
          isDisabled ? 'text-gray-500' : 'text-white'
        }`}
      >
        {getTitle()}
      </Text>
    </TouchableOpacity>
  );
};

export default SaveButton; 