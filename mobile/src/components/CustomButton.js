import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

import COLORS from '../constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';

const CustomButton = ({ title, onPress, icon, style,textStyle, ...props }) => (
  <TouchableOpacity style={[styles.button, style]} onPress={onPress} {...props}>
    {icon && <Icon name={icon} size={20} color={COLORS.black} />}
    <Text style={[styles.buttonText,textStyle]}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
    flexDirection:'row',
    justifyContent:'center',
    gap:8,
    marginVertical:16
  },
  buttonText: {
    color: COLORS.black,
    fontSize: 16,
    fontWeight: '400'
  },
});

export default CustomButton;
