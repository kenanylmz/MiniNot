import React, {createContext, useState, useContext, useEffect} from 'react';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TaskContext = createContext();
const TASKS_STORAGE_KEY = '@tasks';

export const TaskProvider = ({children}) => {
  const [tasks, setTasks] = useState([]);

  // Uygulama başladığında görevleri yükle
  useEffect(() => {
    loadTasks();
  }, []);

  // Görevleri AsyncStorage'dan yükle
  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      Alert.alert('Hata', 'Görevler yüklenirken bir hata oluştu');
    }
  };

  // Görevleri AsyncStorage'a kaydet
  const saveTasks = async updatedTasks => {
    try {
      await AsyncStorage.setItem(
        TASKS_STORAGE_KEY,
        JSON.stringify(updatedTasks),
      );
    } catch (error) {
      Alert.alert('Hata', 'Görevler kaydedilirken bir hata oluştu');
    }
  };

  const addTask = async task => {
    try {
      const newTask = {
        id: Date.now().toString(),
        ...task,
        dueDate: task.dueDate ? task.dueDate.toISOString() : null,
        createdAt: new Date().toISOString(),
        subtasks: task.subtasks || [],
        completed: false,
      };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      await saveTasks(updatedTasks);
    } catch (error) {
      Alert.alert('Hata', 'Görev eklenirken bir hata oluştu');
    }
  };

  const updateTask = async (id, updatedTask) => {
    try {
      const updatedTasks = tasks.map(task =>
        task.id === id ? {...task, ...updatedTask} : task,
      );
      setTasks(updatedTasks);
      await saveTasks(updatedTasks);
    } catch (error) {
      Alert.alert('Hata', 'Görev güncellenirken bir hata oluştu');
    }
  };

  const deleteTask = async id => {
    try {
      const updatedTasks = tasks.filter(task => task.id !== id);
      setTasks(updatedTasks);
      await saveTasks(updatedTasks);
    } catch (error) {
      Alert.alert('Hata', 'Görev silinirken bir hata oluştu');
    }
  };

  const toggleTaskComplete = async id => {
    try {
      const updatedTasks = tasks.map(task =>
        task.id === id ? {...task, completed: !task.completed} : task,
      );
      setTasks(updatedTasks);
      await saveTasks(updatedTasks);
    } catch (error) {
      Alert.alert('Hata', 'Görev durumu güncellenirken bir hata oluştu');
    }
  };

  const getTasksByDate = date => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const value = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    getTasksByDate,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
