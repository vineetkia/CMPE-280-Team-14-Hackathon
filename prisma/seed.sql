-- StudyPilot Seed Data
-- Run: docker exec -i studypilot-db psql -U studypilot < prisma/seed.sql

-- Clear existing data
DELETE FROM "Message";
DELETE FROM "Conversation";
DELETE FROM "calendar_events";
DELETE FROM "Assignment";
DELETE FROM "Todo";

-- ─── Todos ──────────────────────────────────────────────
INSERT INTO "Todo" (id, title, description, completed, priority, category, "dueDate", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(), 'Review calculus notes', 'Go through chapters 5-7 on integration techniques', false, 'high', 'study', '2026-03-22', NOW(), NOW()),
  (gen_random_uuid(), 'Prepare for Chemistry quiz', 'Focus on organic chemistry reaction mechanisms', false, 'medium', 'exam', '2026-03-23', NOW(), NOW()),
  (gen_random_uuid(), 'Read History chapter 12', 'The Cold War and its global impact', true, 'low', 'study', '2026-03-19', NOW(), NOW()),
  (gen_random_uuid(), 'Complete Data Structures homework', 'Implement binary search tree operations', false, 'high', 'assignment', '2026-03-25', NOW(), NOW()),
  (gen_random_uuid(), 'Study for CMPE 280 midterm', 'Review React, Next.js, TypeScript, and system design topics', false, 'high', 'exam', '2026-03-28', NOW(), NOW()),
  (gen_random_uuid(), 'Write research paper outline', 'AI in education - literature review section', false, 'medium', 'project', '2026-03-30', NOW(), NOW());

-- ─── Assignments ────────────────────────────────────────
INSERT INTO "Assignment" (id, title, subject, description, "dueDate", status, priority, grade, "createdAt", "updatedAt") VALUES
  (gen_random_uuid(), 'Linear Algebra Problem Set', 'Mathematics', 'Complete exercises 1-15 from chapter 8 on eigenvalues and eigenvectors', '2026-03-25', 'in-progress', 'high', NULL, NOW(), NOW()),
  (gen_random_uuid(), 'Physics Lab Report', 'Physics', 'Write lab report for pendulum experiment including error analysis', '2026-03-22', 'not-started', 'medium', NULL, NOW(), NOW()),
  (gen_random_uuid(), 'Essay on Renaissance Art', 'History', '2000 words on Italian Renaissance painters and their influence on modern art', '2026-03-28', 'completed', 'medium', 'A', NOW(), NOW()),
  (gen_random_uuid(), 'CMPE 280 Hackathon Project', 'Software Engineering', 'Build StudyPilot - an AI-powered study dashboard with voice assistant', '2026-04-05', 'in-progress', 'high', NULL, NOW(), NOW()),
  (gen_random_uuid(), 'Database Systems Homework', 'Computer Science', 'SQL query optimization and normalization exercises', '2026-03-26', 'not-started', 'medium', NULL, NOW(), NOW());

-- ─── Calendar Events ────────────────────────────────────
INSERT INTO "calendar_events" (id, title, description, date, type, color, "createdAt", "updatedAt") VALUES
  (gen_random_uuid(), 'Calculus Midterm', 'Covers chapters 1-8, bring calculator', '2026-03-24 09:00:00', 'exam', '#ef4444', NOW(), NOW()),
  (gen_random_uuid(), 'Chemistry Class', 'Room 201, Science Building', '2026-03-21 10:30:00', 'class', '#3b82f6', NOW(), NOW()),
  (gen_random_uuid(), 'Study Group - Physics', 'Library, Room 301', '2026-03-22 14:00:00', 'study', '#10b981', NOW(), NOW()),
  (gen_random_uuid(), 'CMPE 280 Lecture', 'Advanced React patterns and server components', '2026-03-21 13:00:00', 'class', '#8b5cf6', NOW(), NOW()),
  (gen_random_uuid(), 'Office Hours - Prof. Smith', 'Discuss research paper topic', '2026-03-23 15:00:00', 'other', '#f59e0b', NOW(), NOW()),
  (gen_random_uuid(), 'Team Meeting - Hackathon', 'Sprint planning for StudyPilot features', '2026-03-22 18:00:00', 'study', '#6366f1', NOW(), NOW());

-- ─── Conversations ──────────────────────────────────────
WITH new_conv AS (
  INSERT INTO "Conversation" (id, title, "createdAt", "updatedAt")
  VALUES (gen_random_uuid(), 'Help with calculus integration', NOW(), NOW())
  RETURNING id
)
INSERT INTO "Message" (id, role, content, timestamp, "conversationId")
SELECT gen_random_uuid(), 'user', 'Can you help me understand integration by parts?', '2026-03-19 10:00:00'::timestamp, id FROM new_conv
UNION ALL
SELECT gen_random_uuid(), 'assistant', 'Of course! Integration by parts is based on the product rule. The formula is: int u dv = uv - int v du. Steps: 1. Choose u 2. Choose dv 3. Find du 4. Find v 5. Plug into the formula. Would you like me to work through an example?', '2026-03-19 10:00:05'::timestamp, id FROM new_conv;
