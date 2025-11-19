const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'quiz.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    init();
  }
});

function init() {
  db.run(`CREATE TABLE IF NOT EXISTS quiz_state (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    questions TEXT
  )`, (err) => {
    if (err) {
      console.error('Error creating table', err.message);
    } else {
        // Initialize with empty state if it doesn't exist
        db.get("SELECT * FROM quiz_state WHERE id = 1", (err, row) => {
            if (err) {
                console.error("Error checking initial state", err);
            } else if (!row) {
                db.run("INSERT INTO quiz_state (id, questions) VALUES (1, '[]')");
            }
        });
    }
  });
}

function getState(callback) {
  db.get("SELECT questions FROM quiz_state WHERE id = 1", (err, row) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, row ? JSON.parse(row.questions) : []);
    }
  });
}

function saveState(questions, callback) {
  const questionsJson = JSON.stringify(questions);
  db.run("UPDATE quiz_state SET questions = ? WHERE id = 1", [questionsJson], function(err) {
    if (callback) callback(err);
  });
}

module.exports = {
  getState,
  saveState
};
