import React from 'react';
import { Text, StyleSheet } from 'react-native';

import COLORS from '../constants/colors';

const LabelText = ({ text, style }) => (
  <Text style={[styles.label, style]}>{text}</Text>
);

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
});

export default LabelText;
