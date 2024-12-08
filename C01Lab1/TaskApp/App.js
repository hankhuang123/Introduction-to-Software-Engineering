import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import ToDoList from './components/ToDoList';  

export default function App() {
  return (
    <View style={styles.container}>
      <ToDoList initialTasks={['Read a Book', 'Go for a walk']} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

