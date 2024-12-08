import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import 'react-native-get-random-values';
const AddTask = ({ onAddTask }) => {
    const [title, setTitle] = useState('');

    const handleAddTask = () => {
        if (title.trim()) {
            onAddTask(title);
            setTitle('');
        }
    };

    return (
        <View style={styles.addCounterForm}>
            <TextInput
                style={styles.input}
                placeholder="Enter the new Task"
                value={title}
                onChangeText={text => setTitle(text)}
                
            />
            <Button title="Add ToDo" onPress={handleAddTask} />
        </View>
    );
};




const styles = StyleSheet.create({
  addCounterForm: {
    marginVertical: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default AddTask;