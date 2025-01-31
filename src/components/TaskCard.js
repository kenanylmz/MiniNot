import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS} from '../utils/colors';
import {useCustomAlert} from '../hooks/useCustomAlert';
import CustomAlert from './CustomAlert';

const TaskCard = ({task, onPress, onDelete, onToggleComplete}) => {
  const {alertConfig, showAlert, hideAlert} = useCustomAlert();

  const formatDate = dateString => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
  };

  const handleDelete = () => {
    showAlert({
      title: 'Görev Silme',
      message: 'Bu görevi silmek istediğinizden emin misiniz?',
      type: 'warning',
      buttons: [
        {
          text: 'İptal',
          style: 'cancel',
          onPress: () => {},
        },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => onDelete(task.id),
        },
      ],
    });
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.container, task.completed && styles.completedTask]}
        onPress={onPress}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => onToggleComplete(task.id)}>
          <Icon
            name={task.completed ? 'checkbox-marked' : 'checkbox-blank-outline'}
            size={24}
            color={task.completed ? COLORS.primary : COLORS.text.secondary}
          />
        </TouchableOpacity>
        <View style={styles.content}>
          <Text
            style={[styles.title, task.completed && styles.completedText]}
            numberOfLines={1}>
            {task.title}
          </Text>
          {task.description ? (
            <Text
              style={[
                styles.description,
                task.completed && styles.completedText,
              ]}
              numberOfLines={2}>
              {task.description}
            </Text>
          ) : null}
          {task.subtasks.length > 0 && (
            <View style={styles.subtaskInfo}>
              <Icon
                name="format-list-checks"
                size={16}
                color={COLORS.text.secondary}
              />
              <Text style={styles.subtaskText}>
                {task.subtasks.filter(st => st.completed).length}/
                {task.subtasks.length}
              </Text>
            </View>
          )}
          {task.dueDate && (
            <View style={styles.dateContainer}>
              <Icon name="calendar" size={16} color={COLORS.text.secondary} />
              <Text style={styles.dateText}>{formatDate(task.dueDate)}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Icon name="delete-outline" size={24} color={COLORS.danger} />
        </TouchableOpacity>
      </TouchableOpacity>
      <CustomAlert {...alertConfig} onClose={hideAlert} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  completedTask: {
    backgroundColor: '#F5F5F5',
    opacity: 0.8,
  },
  checkbox: {
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: COLORS.text.secondary,
  },
  description: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  subtaskInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtaskText: {
    marginLeft: 4,
    fontSize: 12,
    color: COLORS.text.secondary,
  },
  deleteButton: {
    padding: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dateText: {
    marginLeft: 4,
    fontSize: 12,
    color: COLORS.text.secondary,
  },
});

export default TaskCard;
