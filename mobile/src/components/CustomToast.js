import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

import COLORS from '../constants/colors';
import { STRINGS } from '..';

const CustomToast = ({ message, type, visible, onClose }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const isSuccess = type === STRINGS.LABELS.success;
  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        onClose();
      }, 3000);
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, fadeAnim, onClose]);

  const getBackgroundColor = () => {
    if (type === 'success') return COLORS.green10;
    if (type === 'error') return COLORS.error;
    return COLORS.primary;
  };

  return (
    <Animated.View
      style={[
        styles.toastContainer, isSuccess ? styles.successContainer : styles.errorContainer,
        {
          opacity: fadeAnim,
          // backgroundColor: getBackgroundColor(),
        },
      ]}
    >
      <Text style={isSuccess ? styles.successToastText : styles.errorToastText}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    bottom: 70,
    left: 20,
    right: 20,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    // justifyContent: 'center',
    flexDirection: 'row',
    zIndex: 1000,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
  },
  successToastText: {
    color: COLORS.green,
    fontSize: 14,
  },
  errorToastText: {
    color: COLORS.red,
    fontSize: 14,
  },
  successContainer: {
    backgroundColor: COLORS.green10,
    borderColor: COLORS.green20
  },
  errorContainer: {
    backgroundColor: COLORS.red10,
    borderColor: COLORS.red20
  },
});

export default CustomToast;
