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
import {useTasks} from '../../contexts/TaskContext';
import {COLORS} from '../../utils/colors';
import {useCustomAlert} from '../../hooks/useCustomAlert';
import CustomAlert from '../../components/CustomAlert';
import DateTimePicker from '@react-native-community/datetimepicker';

const EditTaskScreen = ({route, navigation}) => {
  const {task} = route.params;
  const {updateTask} = useTasks();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [dueDate, setDueDate] = useState(
    task.dueDate ? new Date(task.dueDate) : null,
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [subtasks, setSubtasks] = useState(task.subtasks || []);
  const [newSubtask, setNewSubtask] = useState('');
  const {alertConfig, showAlert, hideAlert} = useCustomAlert();

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([
        ...subtasks,
        {id: Date.now().toString(), title: newSubtask.trim(), completed: false},
      ]);
      setNewSubtask('');
    }
  };

  const handleRemoveSubtask = id => {
    setSubtasks(subtasks.filter(subtask => subtask.id !== id));
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Uyarı', 'Görev başlığı boş olamaz');
      return;
    }

    updateTask(task.id, {
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate ? dueDate.toISOString() : null,
      subtasks,
    });
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.titleInput}
            placeholder="Görev Başlığı"
            value={title}
            onChangeText={setTitle}
            maxLength={50}
          />
          <TextInput
            style={styles.descriptionInput}
            placeholder="Açıklama (İsteğe bağlı)"
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />
          <View style={styles.subtasksContainer}>
            <Text style={styles.subtasksTitle}>Alt Görevler</Text>
            <View style={styles.addSubtaskContainer}>
              <TextInput
                style={styles.subtaskInput}
                placeholder="Alt görev ekle"
                value={newSubtask}
                onChangeText={setNewSubtask}
                onSubmitEditing={handleAddSubtask}
              />
              <TouchableOpacity
                style={styles.addSubtaskButton}
                onPress={handleAddSubtask}>
                <Icon name="plus" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            {subtasks.map(subtask => (
              <View key={subtask.id} style={styles.subtaskItem}>
                <Text style={styles.subtaskText}>{subtask.title}</Text>
                <TouchableOpacity
                  onPress={() => handleRemoveSubtask(subtask.id)}
                  style={styles.removeSubtaskButton}>
                  <Icon name="close" size={20} color={COLORS.text.secondary} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Güncelle</Text>
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
  formContainer: {
    padding: 16,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
    paddingVertical: 8,
    marginBottom: 16,
  },
  descriptionInput: {
    fontSize: 16,
    color: COLORS.text.primary,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    marginBottom: 24,
  },
  dateContainer: {
    marginBottom: 24,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 8,
    padding: 12,
  },
  dateText: {
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.text.primary,
  },
  subtasksContainer: {
    marginBottom: 24,
  },
  subtasksTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 12,
  },
  addSubtaskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  subtaskInput: {
    flex: 1,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
  addSubtaskButton: {
    padding: 8,
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  subtaskText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text.primary,
  },
  removeSubtaskButton: {
    padding: 4,
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: COLORS.background,
  },
  button: {
    backgroundColor: COLORS.primary,
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

export default EditTaskScreen;
