Note.js

```jsx
import './App.css';

const Note = ({entry, editNote, deleteNote}) => {

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div style={NoteStyle.note}>
            <span style={{ fontSize: '0.75rem', display: 'block', marginBottom: '5px' }}>
                {formatDate(entry.createdAt)}
            </span>
            <p style={NoteStyle.text}>{entry.title}</p>
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

In server.js, we modify the postNote route to include the date when creating the note.

server.js:

```jsx
// Post a note
app.post("/postNote", express.json(), async (req, res) => {
    try {
      // Basic body request check
      const { title, content } = req.body;
      const createdAt = new Date();

      if (!title || !content) {
        return res
          .status(400)
          .json({ error: "Title and content are both required." });
      }
  
      // Send note to database
      const collection = db.collection(COLLECTIONS.notes);
      const result = await collection.insertOne({
        title,
        content,
        createdAt
      });
      res.json({
        response: "Note added succesfully.",
        insertedId: result.insertedId,
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
```
