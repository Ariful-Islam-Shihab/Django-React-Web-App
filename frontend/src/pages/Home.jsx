import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Note";
import '../styles/Home.css'
function Home() {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error,setError] = useState(null);

  useEffect(() => {
    getNotes();
  }, []);

  async function getNotes() {
    try {
      setLoading(true);
      const res = await api.get("/api/notes/");
      setNotes(res.data);
    } catch (e) {
      setError(e.response?.status + ' ' + (e.response?.data?.detail || e.message));
    } finally {
      setLoading(false);
    }
  }

  async function deleteNote(id) {
    try {
      const res = await api.delete(`/api/notes/delete/${id}/`); // ensure trailing slash if backend expects it
      if (res.status === 204){
        // deleted
      }
      await getNotes();
    } catch (e){
      alert("Delete failed");
      console.error(e);
    }
  }

  async function createNote(e) {
    e.preventDefault();
    try {
      const res = await api.post("/api/notes/", { content, title }); // fixed leading slash
      if (res.status === 201){
        setTitle('');
        setContent('');
      }
      await getNotes();
    } catch (e){
      alert("Create failed");
      console.error(e);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <div>
        <h2>Notes</h2>
        {notes.length === 0 && <p>No notes yet.</p>}
        {notes.map((note)=><Note note={note} onDelete={deleteNote} key={note.id} />)}
      </div>
      <h2>Create a Note</h2>
      <form onSubmit={createNote}>
        <label htmlFor="title">Title</label>
        <br />
        <input
          type="text"
          id="title"
          name="title"
          required
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <label htmlFor="content">Content</label>
        <br />
        <textarea
          id="content"
          name="content"
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <br />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}
export default Home;
