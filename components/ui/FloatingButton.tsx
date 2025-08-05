import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface FloatingButtonProps extends TouchableOpacityProps {
  icon?: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
  iconColor?: string;
  backgroundColor?: string;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({
  icon = 'add',
  iconSize = 24,
  iconColor = 'white',
  backgroundColor = '#3B82F6',
  style,
  ...props
}) => {
  return (
    <TouchableOpacity
      style={[{
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 100 : 80,
        right: 24,
        backgroundColor,
        borderRadius: 9999,
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8,
      }, style]}
      {...props}
    >
      <Ionicons name={icon} size={iconSize} color={iconColor} />
    </TouchableOpacity>
  );
};

export default FloatingButton; 