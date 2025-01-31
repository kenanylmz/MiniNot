import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Router from './src/router';
import {CategoryProvider} from './src/contexts/CategoryContext';
import {NoteProvider} from './src/contexts/NoteContext';
import {TaskProvider} from './src/contexts/TaskContext';

const App = () => {
  return (
    <SafeAreaProvider>
      <NoteProvider>
        <CategoryProvider>
          <TaskProvider>
            <Router />
          </TaskProvider>
        </CategoryProvider>
      </NoteProvider>
    </SafeAreaProvider>
  );
};

export default App;
