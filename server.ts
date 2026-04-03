import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import db from "./db.ts";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  
  // Students
  app.get("/api/students", (req, res) => {
    const students = db.prepare('SELECT * FROM students').all();
    res.json(students);
  });

  app.post("/api/students", (req, res) => {
    const { name, email } = req.body;
    try {
      const info = db.prepare('INSERT INTO students (name, email) VALUES (?, ?)').run(name, email);
      res.status(201).json({ id: info.lastInsertRowid, name, email });
    } catch (err) {
      res.status(400).json({ error: "Email already exists or invalid data" });
    }
  });

  // Instructors
  app.get("/api/instructors", (req, res) => {
    const instructors = db.prepare('SELECT * FROM instructors').all();
    res.json(instructors);
  });

  app.post("/api/instructors", (req, res) => {
    const { name, email, department } = req.body;
    try {
      const info = db.prepare('INSERT INTO instructors (name, email, department) VALUES (?, ?, ?)').run(name, email, department);
      res.status(201).json({ id: info.lastInsertRowid, name, email, department });
    } catch (err) {
      res.status(400).json({ error: "Email already exists or invalid data" });
    }
  });

  // Courses
  app.get("/api/courses", (req, res) => {
    const courses = db.prepare('SELECT * FROM courses').all();
    res.json(courses);
  });

  app.post("/api/courses", (req, res) => {
    const { title, description, credits } = req.body;
    try {
      const info = db.prepare('INSERT INTO courses (title, description, credits) VALUES (?, ?, ?)')
        .run(title, description, credits);
      res.status(201).json({ id: info.lastInsertRowid, title, description, credits });
    } catch (err) {
      res.status(400).json({ error: "Invalid course data" });
    }
  });

  // Sections
  app.get("/api/sections", (req, res) => {
    const sections = db.prepare(`
      SELECT s.*, c.title as course_title, i.name as instructor_name 
      FROM sections s 
      JOIN courses c ON s.course_id = c.id
      JOIN instructors i ON s.instructor_id = i.id
    `).all();
    res.json(sections);
  });

  app.post("/api/sections", (req, res) => {
    const { course_id, instructor_id, semester, year, room } = req.body;
    try {
      const info = db.prepare('INSERT INTO sections (course_id, instructor_id, semester, year, room) VALUES (?, ?, ?, ?, ?)')
        .run(course_id, instructor_id, semester, year, room);
      res.status(201).json({ id: info.lastInsertRowid });
    } catch (err) {
      res.status(400).json({ error: "Invalid section data" });
    }
  });

  // Enrollments
  app.get("/api/enrollments", (req, res) => {
    const enrollments = db.prepare(`
      SELECT e.*, s.name as student_name, c.title as course_title, sec.semester, sec.year
      FROM enrollments e
      JOIN students s ON e.student_id = s.id
      JOIN sections sec ON e.section_id = sec.id
      JOIN courses c ON sec.course_id = c.id
    `).all();
    res.json(enrollments);
  });

  app.post("/api/enrollments", (req, res) => {
    const { student_id, section_id } = req.body;
    try {
      const info = db.prepare('INSERT INTO enrollments (student_id, section_id) VALUES (?, ?)')
        .run(student_id, section_id);
      res.status(201).json({ id: info.lastInsertRowid });
    } catch (err) {
      res.status(400).json({ error: "Student already enrolled in this section" });
    }
  });

  app.patch("/api/enrollments/:id/mark", (req, res) => {
    const { id } = req.params;
    const { mark, grade } = req.body;
    try {
      db.prepare('UPDATE enrollments SET mark = ?, grade = ? WHERE id = ?').run(mark, grade, id);
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: "Failed to update mark" });
    }
  });

  // Stats
  app.get("/api/stats", (req, res) => {
    const studentCount = db.prepare('SELECT COUNT(*) as count FROM students').get().count;
    const courseCount = db.prepare('SELECT COUNT(*) as count FROM courses').get().count;
    const instructorCount = db.prepare('SELECT COUNT(*) as count FROM instructors').get().count;
    const enrollmentCount = db.prepare('SELECT COUNT(*) as count FROM enrollments').get().count;
    res.json({ studentCount, courseCount, instructorCount, enrollmentCount });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
