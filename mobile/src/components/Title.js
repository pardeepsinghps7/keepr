import React from 'react';
import { Text, StyleSheet } from 'react-native';

import COLORS from '../constants/colors';

const Title = ({ text, style }) => (
  <Text style={[styles.title, style]}>{text}</Text>
);

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 24,
  },
});

export default Title;
