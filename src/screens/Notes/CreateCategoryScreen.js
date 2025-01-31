import React, {useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import {useCategories} from '../../contexts/CategoryContext';
import {COLORS} from '../../utils/colors';

const CreateCategoryScreen = ({navigation}) => {
  const [categoryName, setCategoryName] = useState('');
  const {addCategory} = useCategories();

  const handleSave = () => {
    if (addCategory(categoryName)) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Kategori Adı"
          value={categoryName}
          onChangeText={setCategoryName}
          maxLength={30}
        />
        <TouchableOpacity
          style={[styles.button, {backgroundColor: COLORS.primary}]}
          onPress={handleSave}>
          <Text style={styles.buttonText}>Kategori Ekle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  formContainer: {
    padding: 16,
  },
  input: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
    paddingVertical: 8,
    marginBottom: 24,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.text.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateCategoryScreen;
