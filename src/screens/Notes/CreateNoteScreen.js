import React, {useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNotes} from '../../contexts/NoteContext';
import ColorPicker from '../../components/ColorPicker';
import {COLORS} from '../../utils/colors';
import {useCustomAlert} from '../../hooks/useCustomAlert';
import CustomAlert from '../../components/CustomAlert';

const CreateNoteScreen = ({route, navigation}) => {
  const {category = 'Genel'} = route.params || {};
  const {addNote, categories} = useNotes();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS.noteColors[0]);
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const {alertConfig, showAlert, hideAlert} = useCustomAlert();

  const handleSave = () => {
    if (!title.trim()) {
      showAlert({
        title: 'Uyarı',
        message: 'Başlık alanı boş olamaz',
        type: 'warning',
        buttons: [{text: 'Tamam', onPress: () => {}}],
      });
      return;
    }

    if (!content.trim()) {
      showAlert({
        title: 'Uyarı',
        message: 'İçerik alanı boş olamaz',
        type: 'warning',
        buttons: [{text: 'Tamam', onPress: () => {}}],
      });
      return;
    }

    addNote({
      title: title.trim(),
      content: content.trim(),
      color: selectedColor,
      category: selectedCategory,
    });
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.postItPreview}>
          <View
            style={[styles.noteContainer, {backgroundColor: selectedColor}]}>
            {/* Raptiye önizlemesi */}
            <View style={styles.pinContainer}>
              <Icon name="pin" size={24} color="#CD5C5C" />
            </View>
            <TextInput
              style={styles.titleInput}
              placeholder="Başlık"
              placeholderTextColor={COLORS.text.primary}
              value={title}
              onChangeText={setTitle}
              maxLength={50}
            />
            <TextInput
              style={styles.contentInput}
              placeholder="İçerik"
              placeholderTextColor={COLORS.text.primary}
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
            />
            {/* Post-it gölge efekti */}
            <View style={styles.shadow} />
          </View>
        </View>

        <ColorPicker
          selectedColor={selectedColor}
          onSelectColor={setSelectedColor}
        />
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: COLORS.primary}]}
          onPress={handleSave}>
          <Text style={styles.buttonText}>Kaydet</Text>
        </TouchableOpacity>
      </View>
      <CustomAlert {...alertConfig} onClose={hideAlert} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  postItPreview: {
    padding: 24,
    alignItems: 'center',
  },
  noteContainer: {
    width: '100%',
    padding: 16,
    borderRadius: 2,
    minHeight: 200,
    transform: [{rotate: '-1deg'}],
    position: 'relative',
  },
  pinContainer: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    zIndex: 2,
    elevation: 5,
    transform: [{rotate: '1deg'}],
  },
  titleInput: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginTop: 10,
    marginBottom: 16,
  },
  contentInput: {
    fontSize: 16,
    color: COLORS.text.primary,
    minHeight: 150,
  },
  shadow: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    left: 8,
    top: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 2,
    zIndex: -1,
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: COLORS.background,
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

export default CreateNoteScreen;
