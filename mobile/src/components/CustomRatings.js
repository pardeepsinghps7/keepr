//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import COLORS from '../constants/colors';

// create a component
const CustomRatings = ({ list = [1, 2, 3, 4, 5], rating, setRating, selectedSize, unselectedSize, isDisable = false, ...props }) => {
    
    return (
        <View style={[styles.starContainer, { ...props }]}>
            {list?.map((i) => (
                <TouchableOpacity key={i} onPress={() => isDisable ? undefined : setRating(i)}>
                    {i <= rating ? <Octicons
                        name={'star-fill'}
                        size={selectedSize ?? 23}
                        color={COLORS.black}
                    /> : <SimpleLineIcons
                        name={'star'}
                        size={unselectedSize ?? 20}
                        color={COLORS.black}
                    />}
                </TouchableOpacity>
            ))}
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    starContainer: { flexDirection: 'row', gap: 8 },
});

//make this component available to the app
export default CustomRatings;
