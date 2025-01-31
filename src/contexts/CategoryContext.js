import React, {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNotes} from './NoteContext';
import {useCustomAlert} from '../hooks/useCustomAlert';
import CustomAlert from '../components/CustomAlert';

const CategoryContext = createContext();

export const CategoryProvider = ({children}) => {
  const [categories, setCategories] = useState(['Genel']);
  const [selectedCategory, setSelectedCategory] = useState('Genel');
  const {handleCategoryDelete, handleCategoryUpdate} = useNotes();
  const {alertConfig, showAlert, hideAlert} = useCustomAlert();

  // Uygulama başladığında kategorileri yükle
  useEffect(() => {
    loadCategories();
  }, []);

  // Kategorileri AsyncStorage'dan yükle
  const loadCategories = async () => {
    try {
      const savedCategories = await AsyncStorage.getItem('categories');
      if (savedCategories) {
        const parsedCategories = JSON.parse(savedCategories);
        // Genel kategorisinin her zaman var olduğundan emin ol
        if (!parsedCategories.includes('Genel')) {
          parsedCategories.unshift('Genel');
        }
        setCategories(parsedCategories);
      }
    } catch (error) {
      showAlert({
        title: 'Hata',
        message: 'Kategoriler yüklenirken bir hata oluştu',
        type: 'error',
        buttons: [{text: 'Tamam', onPress: () => {}}],
      });
    }
  };

  // Kategorileri AsyncStorage'a kaydet
  const saveCategories = async updatedCategories => {
    try {
      await AsyncStorage.setItem(
        'categories',
        JSON.stringify(updatedCategories),
      );
    } catch (error) {
      showAlert({
        title: 'Hata',
        message: 'Kategoriler kaydedilirken bir hata oluştu',
        type: 'error',
        buttons: [{text: 'Tamam', onPress: () => {}}],
      });
    }
  };

  const addCategory = categoryName => {
    try {
      if (!categoryName.trim()) {
        showAlert({
          title: 'Uyarı',
          message: 'Kategori adı boş olamaz',
          type: 'error',
          buttons: [{text: 'Tamam', onPress: () => {}}],
        });
        return false;
      }

      if (categories.includes(categoryName.trim())) {
        showAlert({
          title: 'Uyarı',
          message: 'Bu kategori zaten mevcut',
          type: 'warning',
          buttons: [{text: 'Tamam', onPress: () => {}}],
        });
        return false;
      }

      const updatedCategories = [...categories, categoryName.trim()];
      setCategories(updatedCategories);
      saveCategories(updatedCategories);

      showAlert({
        title: 'Başarılı',
        message: 'Kategori başarıyla eklendi',
        type: 'success',
        buttons: [{text: 'Tamam', onPress: () => {}}],
      });
      return true;
    } catch (error) {
      showAlert({
        title: 'Hata',
        message: 'Kategori eklenirken bir hata oluştu',
        type: 'error',
        buttons: [{text: 'Tamam', onPress: () => {}}],
      });
      return false;
    }
  };

  const deleteCategory = categoryName => {
    try {
      if (categoryName === 'Genel') {
        showAlert({
          title: 'Uyarı',
          message: 'Genel kategori silinemez',
          type: 'warning',
          buttons: [{text: 'Tamam', onPress: () => {}}],
        });
        return false;
      }

      const updatedCategories = categories.filter(cat => cat !== categoryName);
      setCategories(updatedCategories);
      saveCategories(updatedCategories);
      handleCategoryDelete(categoryName);
      return true;
    } catch (error) {
      showAlert({
        title: 'Hata',
        message: 'Kategori silinirken bir hata oluştu',
        type: 'error',
        buttons: [{text: 'Tamam', onPress: () => {}}],
      });
      return false;
    }
  };

  const updateCategory = (oldName, newName) => {
    try {
      if (oldName === 'Genel') {
        showAlert({
          title: 'Uyarı',
          message: 'Genel kategori güncellenemez',
          type: 'warning',
          buttons: [{text: 'Tamam', onPress: () => {}}],
        });
        return false;
      }

      if (!newName.trim()) {
        showAlert({
          title: 'Uyarı',
          message: 'Kategori adı boş olamaz',
          type: 'error',
          buttons: [{text: 'Tamam', onPress: () => {}}],
        });
        return false;
      }

      if (categories.includes(newName.trim())) {
        showAlert({
          title: 'Uyarı',
          message: 'Bu kategori zaten mevcut',
          type: 'warning',
          buttons: [{text: 'Tamam', onPress: () => {}}],
        });
        return false;
      }

      const updatedCategories = categories.map(cat =>
        cat === oldName ? newName.trim() : cat,
      );
      setCategories(updatedCategories);
      saveCategories(updatedCategories);
      handleCategoryUpdate(oldName, newName.trim());

      showAlert({
        title: 'Başarılı',
        message: 'Kategori başarıyla güncellendi',
        type: 'success',
        buttons: [{text: 'Tamam', onPress: () => {}}],
      });
      return true;
    } catch (error) {
      showAlert({
        title: 'Hata',
        message: 'Kategori güncellenirken bir hata oluştu',
        type: 'error',
        buttons: [{text: 'Tamam', onPress: () => {}}],
      });
      return false;
    }
  };

  const value = {
    categories,
    selectedCategory,
    setSelectedCategory,
    addCategory,
    deleteCategory,
    updateCategory,
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
      <CustomAlert {...alertConfig} onClose={hideAlert} />
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};
