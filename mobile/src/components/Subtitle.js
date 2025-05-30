import React from 'react';
import { Text, StyleSheet } from 'react-native';

import COLORS from '../constants/colors';

const Subtitle = ({ text, style }) => (
  <Text style={[styles.subtitle, style]}>{text}</Text>
);

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 16,
  },
});

export default Subtitle;
