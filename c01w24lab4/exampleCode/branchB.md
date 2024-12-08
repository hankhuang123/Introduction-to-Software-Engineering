in server.js, add:


```jsx
// Delete a note
app.delete("/deleteNote/:noteId", express.json(), async (req, res) => {
  try {
    // Basic param checking
    const noteId = req.params.noteId;
    if (!ObjectId.isValid(noteId)) {
      return res.status(400).json({ error: "Invalid note ID." });
    }

    // Find note with given ID
    const collection = db.collection(COLLECTIONS.notes);
    const data = await collection.deleteOne({
      _id: new ObjectId(noteId),
    });


    if (data.deletedCount === 0) {
      return res
        .status(404)
        .json({ error: "Unable to find note with given ID." });
    }
    res.json({ response: `Document with ID ${noteId} deleted.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})
```


in App.js, add:

```jsx
const deleteNote = async (entry) => {
    try {
      await fetch(`http://localhost:4000/deleteNote/${entry._id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
      })
      .then(async (response) => {
        if (!response.ok) {
          console.log("Served failed:", response.status)
          alert("Failed to delete note!")
        } else {
            await response.json().then(() => {
            deleteNoteState(entry._id)
        }) 
        }
      })
    } catch (error) {
      console.log("Delete function failed:", error)
      alert("Failed to delete note!")
    } finally {
      setLoading(false)
    }
  }
```