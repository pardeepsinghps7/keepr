import React from 'react';
import { TextInput, StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';

import COLORS from '../constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import imagesPath from '../constants/images';

const CustomInput = ({
  label,
  isOptional = false,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  style,
  icon,
  iconSize,
  iconPress,
  isSearch = false,
  keyboardType,
  mainViewProps,
  ...props
}) => (
  <View style={[mainViewProps, styles.mainViewProps]}>
    <View style={styles.labelContainer}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}
      {isOptional && <Text style={styles.optional}>(Optional)</Text>}
    </View>
    <View style={[styles.inputWrapper, style]}>
      {isSearch && <Image source={imagesPath.search} style={styles.search} />}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        maxLength={40}
        returnKeyType="done"
        keyboardType={keyboardType ?? 'default'}
        secureTextEntry={secureTextEntry}
        textContentType="oneTimeCode"
        placeholderTextColor={COLORS.placeholderText}
        {...props}
      />
      {icon && (
        <TouchableOpacity onPress={iconPress} style={styles.icon}>
          <Icon name={icon} size={iconSize || 20} color={COLORS.placeholderText} />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  mainViewProps: {
    // marginVertical:16
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    borderRadius: 8,
    marginBottom: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    color: COLORS.black,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  inputLabel: {
    fontWeight: '400',
    fontSize: 16,
    color: COLORS.black,
  },
  optional: { fontStyle: 'normal', fontSize: 14, color: COLORS.text_secondary, },
  icon: {
    // marginLeft: 8,
    paddingHorizontal: 12,
  },
  search: {
    width: 20,
    height: 20,
    tintColor: COLORS.placeholderText,
    marginLeft: 12
  },
});

export default CustomInput;
