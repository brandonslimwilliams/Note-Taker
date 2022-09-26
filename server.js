const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
require("./routes/notes")(app);

app.use(express.urlencoded({ extend: true }));
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  fs.readFile("db/db.json", "utf-8", (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data));
  });
});

app.post("/api/notes", (req, res) => {
  var newNotes = {
    title: req.body.title,
    text: req.body.text,
    id: uuidv4(),
  };

  fs.readFile("db/db.json", "utf-8", (err, data) => {
    if (err) throw err;
    var dataNotes = JSON.parse(data);
    dataNotes.push(newNotes);
    fs.writeFile("db/db.json", JSON.stringify(dataNotes), (err) => {
      err ? console.log(err) : console.log('Created new notes');
    });
    res.sendFile(path.join(__dirname, "/public/notes.html"));
  });
});

app.delete("/api/notes/:id", (req, res) => {
  var deleteNotes = req.params.id;
  fs.readFile("db/db.json", "utf-8", (err, data) => {
    if (err) throw err;
    var database = JSON.parse(data);
    var newNotes = database.filter((note) => note.id !== deleteNotes);
    fs.writeFile("db/db.json", JSON.stringify(newNotes), (err) => {
      err ? console.log(err) : console.log('Deleted notes');
    });
    res.sendFile(path.join(__dirname, '/public/notes.html'));
  });
});
app.listen(PORT, () => console.log(`server started on port ${PORT}`));
