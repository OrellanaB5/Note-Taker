const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const readDbFile = () => {
  const data = fs.readFileSync(path.join(__dirname, './db/db.json'), 'utf8');
  return JSON.parse(data);
};

const writeDbFile = (data) => {
  fs.writeFileSync(
    path.join(__dirname, './db/db.json'),
    JSON.stringify(data, null, 4)
  );
};

app.get('/api/notes', (req, res) => {
  const notes = readDbFile();
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const newNote = { ...req.body, id: uuidv4() };
  const notes = readDbFile();
  notes.push(newNote);
  writeDbFile(notes);
  res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  let notes = readDbFile();
  notes = notes.filter((note) => note.id !== id);
  writeDbFile(notes);
  res.json({ message: 'Note deleted successfully.' });
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
