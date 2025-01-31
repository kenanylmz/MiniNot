import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {COLORS} from '../utils/colors';

const ColorPicker = ({selectedColor, onSelectColor}) => {
  return (
    <View style={styles.container}>
      {COLORS.noteColors.map(color => (
        <TouchableOpacity
          key={color}
          style={[
            styles.colorButton,
            {backgroundColor: color},
            selectedColor === color && styles.selectedColor,
          ]}
          onPress={() => onSelectColor(color)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
});

export default ColorPicker;
