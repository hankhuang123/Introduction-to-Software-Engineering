Note.js

```jsx

import './App.css';

const Note = ({entry, editNote, deleteNote, onChangeColor}) => {

    const handleColorChange = (event) => {
        const newColor = event.target.value;
        onChangeColor(entry._id, newColor);
    };

    return (
        <div style={{...NoteStyle.note, backgroundColor: entry.color || 'grey'}}>
            <p style={NoteStyle.text}>{entry.title}</p>
                <input type="color" onChange={handleColorChange} value={entry.color || 'grey'} />
                <button
                    onClick={() => editNote(entry)}
                    >
                    Edit note
                </button>
                {<button
                    onClick={() => deleteNote(entry)}
                    >
                    Delete note
                </button>}
        </div>
    )

}

export default Note;

const NoteStyle = {
    note: {
      padding: '20px',
      margin: '20px',
      width: '200px',
      borderStyle: 'dotted',
      borderRadius: '30px',
      borderWidth: 'thin',
      overflowWrap: "break-word"
    },
    text: {
      margin: "0px"
    }, 
  }
```




Add the following block of code to App.js:



```jsx

  const onChangeColor = async (noteId, color) => {
    try {
      const response = await fetch(`http://localhost:4000/updateNoteColor/${noteId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ color }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update note color');
      }
  
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === noteId ? { ...note, color: color } : note
        )
      );
    } catch (error) {
      console.error(error);
    }
  };


```


And in App.js, add this line: 

```jsx
onChangeColor={onChangeColor}
```

in the return statement of each Note component:

```jsx

return (
    <div key={entry._id}>
        <Note
        entry={entry} 
        editNote={editNote} 
        deleteNote={deleteNote}
        onChangeColor={onChangeColor}
        />
    </div>
)
```


Add the following block of code to server.js:


```jsx

app.patch('/updateNoteColor/:noteId', express.json(), async (req, res) => {
  const { noteId } = req.params;
  const { color } = req.body;

  if (!ObjectId.isValid(noteId)) {
      return res.status(400).json({ error: "Invalid note ID." });
  }

  try {
      const collection = db.collection('notes');
      await collection.updateOne({ _id: new ObjectId(noteId) }, { $set: { color } });
      res.json({ message: 'Note color updated successfully.' });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});
```
