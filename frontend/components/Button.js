// components/Button.js
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, FONTS } from '../constants/config';

const Button = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary', // primary | outline | ghost
  size = 'md', // sm | md | lg
  style,
  textStyle,
  icon,
}) => {
  const isDisabled = disabled || loading;

  const sizeStyles = {
    sm: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 },
    md: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: 14 },
    lg: { paddingVertical: 18, paddingHorizontal: 32, borderRadius: 16 },
  };

  const textSizes = {
    sm: SIZES.sm,
    md: SIZES.base,
    lg: SIZES.lg,
  };

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.85}
        style={[styles.wrapper, style]}
      >
        <LinearGradient
          colors={isDisabled ? ['#B39DDB', '#9575CD'] : ['#7C3AED', '#6C2BD9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.gradient, sizeStyles[size]]}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} size="small" />
          ) : (
            <View style={styles.row}>
              {icon && <View style={styles.iconLeft}>{icon}</View>}
              <Text style={[styles.primaryText, { fontSize: textSizes[size] }, textStyle]}>
                {title}
              </Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === 'outline') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.85}
        style={[
          styles.outlineBtn,
          sizeStyles[size],
          isDisabled && styles.disabledOutline,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.primary} size="small" />
        ) : (
          <View style={styles.row}>
            {icon && <View style={styles.iconLeft}>{icon}</View>}
            <Text style={[styles.outlineText, { fontSize: textSizes[size] }, textStyle]}>
              {title}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[styles.ghostBtn, sizeStyles[size], style]}
    >
      <Text style={[styles.ghostText, { fontSize: textSizes[size] }, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#6C2BD9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  primaryText: {
    color: COLORS.white,
    fontWeight: FONTS.bold,
    letterSpacing: 0.5,
  },
  outlineBtn: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    width: '100%',
  },
  outlineText: {
    color: COLORS.primary,
    fontWeight: FONTS.semiBold,
    letterSpacing: 0.5,
  },
  disabledOutline: {
    borderColor: COLORS.gray400,
  },
  ghostBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostText: {
    color: COLORS.primary,
    fontWeight: FONTS.medium,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
});

export default Button;
