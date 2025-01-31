import React, {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useCustomAlert} from '../hooks/useCustomAlert';
import CustomAlert from '../components/CustomAlert';

const NoteContext = createContext();

export const NoteProvider = ({children}) => {
  const [notes, setNotes] = useState([]);
  const {alertConfig, showAlert, hideAlert} = useCustomAlert();

  // Uygulama başladığında notları yükle
  useEffect(() => {
    loadNotes();
  }, []);

  // Notları AsyncStorage'dan yükle
  const loadNotes = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem('notes');
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    } catch (error) {
      showAlert({
        title: 'Hata',
        message: 'Notlar yüklenirken bir hata oluştu',
        type: 'error',
        buttons: [{text: 'Tamam', onPress: () => {}}],
      });
    }
  };

  // Notları AsyncStorage'a kaydet
  const saveNotes = async updatedNotes => {
    try {
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
    } catch (error) {
      showAlert({
        title: 'Hata',
        message: 'Notlar kaydedilirken bir hata oluştu',
        type: 'error',
        buttons: [{text: 'Tamam', onPress: () => {}}],
      });
    }
  };

  const addNote = note => {
    try {
      const category = note.category || 'Genel';
      const newNote = {
        id: Date.now().toString(),
        ...note,
        category,
        createdAt: new Date().toISOString(),
      };

      const updatedNotes = [...notes, newNote];
      setNotes(updatedNotes);
      saveNotes(updatedNotes);

      showAlert({
        title: 'Başarılı',
        message: 'Not başarıyla eklendi',
        type: 'success',
        buttons: [{text: 'Tamam', onPress: () => {}}],
      });
      return true;
    } catch (error) {
      showAlert({
        title: 'Hata',
        message: 'Not eklenirken bir hata oluştu',
        type: 'error',
        buttons: [{text: 'Tamam', onPress: () => {}}],
      });
      return false;
    }
  };

  const updateNote = (id, updatedNote, bulkUpdate = null) => {
    try {
      let updatedNotes;

      if (bulkUpdate) {
        // Toplu güncelleme için
        updatedNotes = bulkUpdate;
      } else {
        // Tek not güncellemesi için
        updatedNotes = notes.map(note =>
          note.id === id
            ? {
                ...note,
                ...updatedNote,
                category: updatedNote.category || note.category,
              }
            : note,
        );
      }

      setNotes(updatedNotes);
      saveNotes(updatedNotes);
      return true;
    } catch (error) {
      showAlert({
        title: 'Hata',
        message: 'Not güncellenirken bir hata oluştu',
        type: 'error',
        buttons: [{text: 'Tamam', onPress: () => {}}],
      });
      return false;
    }
  };

  const deleteNote = id => {
    try {
      const updatedNotes = notes.filter(note => note.id !== id);
      setNotes(updatedNotes);
      saveNotes(updatedNotes);
    } catch (error) {
      showAlert({
        title: 'Hata',
        message: 'Not silinirken bir hata oluştu',
        type: 'error',
        buttons: [{text: 'Tamam', onPress: () => {}}],
      });
    }
  };

  const handleCategoryDelete = categoryName => {
    try {
      const updatedNotes = notes.map(note => {
        if (note.category === categoryName) {
          return {...note, category: 'Genel'};
        }
        return note;
      });
      setNotes(updatedNotes);
      saveNotes(updatedNotes);
    } catch (error) {
      showAlert({
        title: 'Hata',
        message: 'Kategori silinirken bir hata oluştu',
        type: 'error',
        buttons: [{text: 'Tamam', onPress: () => {}}],
      });
    }
  };

  const handleCategoryUpdate = (oldName, newName) => {
    try {
      const updatedNotes = notes.map(note => {
        if (note.category === oldName) {
          return {...note, category: newName};
        }
        return note;
      });
      setNotes(updatedNotes);
      saveNotes(updatedNotes);
    } catch (error) {
      showAlert({
        title: 'Hata',
        message: 'Kategori güncellenirken bir hata oluştu',
        type: 'error',
        buttons: [{text: 'Tamam', onPress: () => {}}],
      });
    }
  };

  const getNotesByCategory = category => {
    return notes.filter(note => note.category === category);
  };

  const value = {
    notes,
    addNote,
    updateNote,
    deleteNote,
    handleCategoryDelete,
    handleCategoryUpdate,
    getNotesByCategory,
  };

  return (
    <NoteContext.Provider value={value}>
      {children}
      <CustomAlert {...alertConfig} onClose={hideAlert} />
    </NoteContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error('useNotes must be used within a NoteProvider');
  }
  return context;
};
