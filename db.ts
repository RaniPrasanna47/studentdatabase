import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'database.sqlite'));

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    enrollment_date DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS instructors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    department TEXT
  );

  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    credits INTEGER DEFAULT 3
  );

  CREATE TABLE IF NOT EXISTS sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER,
    instructor_id INTEGER,
    semester TEXT,
    year INTEGER,
    room TEXT,
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (instructor_id) REFERENCES instructors(id)
  );

  CREATE TABLE IF NOT EXISTS enrollments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    section_id INTEGER,
    enrollment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    mark INTEGER,
    grade TEXT,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (section_id) REFERENCES sections(id),
    UNIQUE(student_id, section_id)
  );
`);

// Seed initial data if empty
const studentCount = db.prepare('SELECT COUNT(*) as count FROM students').get().count;
if (studentCount === 0) {
  db.prepare('INSERT INTO students (name, email) VALUES (?, ?)').run('Alice Smith', 'alice@example.com');
  db.prepare('INSERT INTO students (name, email) VALUES (?, ?)').run('Bob Jones', 'bob@example.com');
  
  db.prepare('INSERT INTO instructors (name, email, department) VALUES (?, ?, ?)').run('Dr. Sarah Connor', 'sarah@edu.com', 'Computer Science');
  db.prepare('INSERT INTO instructors (name, email, department) VALUES (?, ?, ?)').run('Prof. James Smith', 'james@edu.com', 'Mathematics');
  
  db.prepare('INSERT INTO courses (title, description, credits) VALUES (?, ?, ?)').run(
    'Web Development', 'Learn React and Node.js', 4
  );
  db.prepare('INSERT INTO courses (title, description, credits) VALUES (?, ?, ?)').run(
    'Database Systems', 'Master SQL and NoSQL', 3
  );

  db.prepare('INSERT INTO sections (course_id, instructor_id, semester, year, room) VALUES (?, ?, ?, ?, ?)').run(1, 1, 'Fall', 2024, 'Room 101');
  db.prepare('INSERT INTO sections (course_id, instructor_id, semester, year, room) VALUES (?, ?, ?, ?, ?)').run(2, 1, 'Fall', 2024, 'Room 102');

  db.prepare('INSERT INTO enrollments (student_id, section_id, mark, grade) VALUES (?, ?, ?, ?)').run(1, 1, 85, 'A');
  db.prepare('INSERT INTO enrollments (student_id, section_id, mark, grade) VALUES (?, ?, ?, ?)').run(2, 1, 72, 'B');
}

export default db;
