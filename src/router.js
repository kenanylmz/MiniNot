import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Notes Screens
import NotesScreen from './screens/Notes/NotesScreen';
import CreateNoteScreen from './screens/Notes/CreateNoteScreen';
import EditNoteScreen from './screens/Notes/EditNoteScreen';
import CreateCategoryScreen from './screens/Notes/CreateCategoryScreen';
import EditCategoryScreen from './screens/Notes/EditCategoryScreen';

// Tasks Screens
import TasksScreen from './screens/Tasks/TasksScreen';
import CreateTaskScreen from './screens/Tasks/CreateTaskScreen';
import EditTaskScreen from './screens/Tasks/EditTaskScreen';

import {COLORS} from './utils/colors';

const Tab = createBottomTabNavigator();
const NotesStack = createNativeStackNavigator();
const TasksStack = createNativeStackNavigator();

const NotesNavigator = () => {
  return (
    <NotesStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.text.white,
        headerTitleStyle: {
          fontWeight: '300',
          fontStyle: 'italic',
          textAlign: 'center',
          fontFamily: 'System',
        },
        headerTitleAlign: 'center',
      }}>
      <NotesStack.Screen
        name="NotesList"
        component={NotesScreen}
        options={{title: 'Notlarım'}}
      />
      <NotesStack.Screen
        name="CreateNote"
        component={CreateNoteScreen}
        options={{title: 'Not Oluştur'}}
      />
      <NotesStack.Screen
        name="EditNote"
        component={EditNoteScreen}
        options={{title: 'Notu Düzenle'}}
      />
      <NotesStack.Screen
        name="CreateCategory"
        component={CreateCategoryScreen}
        options={{title: 'Yeni Kategori'}}
      />
      <NotesStack.Screen
        name="EditCategory"
        component={EditCategoryScreen}
        options={{title: 'Kategoriyi Düzenle'}}
      />
    </NotesStack.Navigator>
  );
};

const TasksNavigator = () => {
  return (
    <TasksStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.text.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <TasksStack.Screen
        name="TasksList"
        component={TasksScreen}
        options={{title: 'Görevlerim'}}
      />
      <TasksStack.Screen
        name="CreateTask"
        component={CreateTaskScreen}
        options={{title: 'Görev Oluştur'}}
      />
      <TasksStack.Screen
        name="EditTask"
        component={EditTaskScreen}
        options={{title: 'Görevi Düzenle'}}
      />
    </TasksStack.Navigator>
  );
};

const Router = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: COLORS.text.white,
          tabBarInactiveTintColor: 'rgba(255,255,255,0.7)',
          tabBarStyle: {
            backgroundColor: COLORS.primary,
            borderTopWidth: 0,
            elevation: 8,
            shadowOpacity: 0.1,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          headerShown: false,
        }}>
        <Tab.Screen
          name="Notes"
          component={NotesNavigator}
          options={{
            title: 'Notlar',
            tabBarIcon: ({color, size}) => (
              <Icon name="note-text" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Tasks"
          component={TasksNavigator}
          options={{
            title: 'Görevler',
            tabBarIcon: ({color, size}) => (
              <Icon
                name="checkbox-marked-circle-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Router;
