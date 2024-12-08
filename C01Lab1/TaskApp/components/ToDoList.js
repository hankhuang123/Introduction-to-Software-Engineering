import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import AddTask from './AddTask';
import 'react-native-get-random-values';

const ToDoList = ({ initialTasks }) => {
    const [toDos, setToDos] = useState(initialTasks.map(task => ({ id: uuidv4(), title: task })));

    const addToDo = (newTitle) => {
        setToDos([...toDos, { id: uuidv4(), title: newTitle }]);
    };

    const removeToDo = (id) => {
        setToDos(toDos.filter(toDo => toDo.id !== id));
    };

    return (
      <View style={styles.container}>
        {toDos.map((toDo) => (
          <View key={toDo.id} style={styles.barContainer}>
            <Text style={styles.title}>{toDo.title}</Text>
            <Button title="Remove" onPress={() => removeToDo(toDo.id)} style={styles.button} />
          </View>
        ))}
        <AddTask onAddTask={addToDo} />
      </View>
    );
    
        }    

ToDoList.defaultProps = {
    initialTasks: [],
};

const styles = StyleSheet.create({
  barContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', 
    padding: 10, 
    marginVertical: 5, 
    borderWidth: 1, 
    borderColor: '#000', 
    borderRadius: 5, 
   
  },
  title: {
    flex: 3, // space
    marginRight: 10},

  container: {
    alignItems: 'center',
    marginTop: 50,
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
});

export default ToDoList;

