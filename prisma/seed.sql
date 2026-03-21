-- StudyPilot Seed Data (with authentication)
-- Run: docker exec -i studypilot-db psql -U studypilot < prisma/seed.sql
--
-- Demo user credentials:
--   Email: demo@sjsu.edu
--   Password: password123

-- Clear existing data (order matters due to foreign keys)
DELETE FROM "Message";
DELETE FROM "Conversation";
DELETE FROM "calendar_events";
DELETE FROM "Assignment";
DELETE FROM "Todo";
DELETE FROM "User";

-- ─── Demo User ──────────────────────────────────────────────
-- Password hash for "password123" using bcrypt with 12 rounds
INSERT INTO "User" (id, name, email, "passwordHash", "createdAt", "updatedAt") VALUES
  ('demo-user-001', 'Vineet Kia', 'demo@sjsu.edu', '$2b$12$.ZzSw5W9uei73Ahl9cx4VeCohsG78w5DdbkXE3.zr7z8BwtzjVr2y', NOW(), NOW());

-- ─── Todos (20 items) ────────────────────────────────────
INSERT INTO "Todo" (id, title, description, completed, priority, category, "dueDate", "createdAt", "updatedAt", "userId") VALUES
  (gen_random_uuid(), 'Review calculus notes', 'Go through chapters 5-7 on integration techniques', false, 'high', 'study', '2026-03-22', NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'Prepare for Chemistry quiz', 'Focus on organic chemistry reaction mechanisms and naming conventions', false, 'medium', 'exam', '2026-03-23', NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'Read History chapter 12', 'The Cold War and its global impact on geopolitics', true, 'low', 'study', '2026-03-19', NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'Complete Data Structures homework', 'Implement binary search tree insert, delete, and traversal operations', false, 'high', 'assignment', '2026-03-25', NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'Study for CMPE 280 midterm', 'Review React, Next.js, TypeScript, and system design topics', false, 'high', 'exam', '2026-03-28', NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'Write research paper outline', 'AI in education - literature review and methodology section', false, 'medium', 'project', '2026-03-30', NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'Practice SQL joins', 'Complete 10 exercises on INNER, LEFT, RIGHT, and FULL OUTER joins', false, 'medium', 'study', '2026-03-24', NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'Submit physics lab pre-lab', 'Answer pre-lab questions for the optics experiment', true, 'high', 'assignment', '2026-03-18', NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'Watch recorded lecture - OS', 'Operating Systems lecture 14 on process scheduling algorithms', false, 'low', 'study', '2026-03-26', NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'Update LinkedIn profile', 'Add CMPE 280 project and new skills section', false, 'low', 'other', '2026-04-01', NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'Debug React component', 'Fix the infinite re-render issue in the dashboard stat cards', true, 'high', 'project', '2026-03-17', NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'Buy textbook for MATH 133', 'Linear Algebra and Its Applications, 6th edition by Lay', true, 'medium', 'other', '2026-03-10', NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'Review pull requests', 'Review team PRs for the hackathon project before sprint deadline', false, 'high', 'project', '2026-03-23', NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'Practice whiteboard problems', 'Solve 3 medium-level LeetCode problems: arrays and hash maps', false, 'medium', 'study', '2026-03-27', NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'Email Professor Fang', 'Ask about extra credit opportunity and final project requirements', false, 'low', 'other', '2026-03-24', NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'Finish English essay draft', 'Complete the 1500-word argumentative essay on climate policy', false, 'high', 'assignment', '2026-03-26', NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'Set up Docker environment', 'Configure Docker Compose for PostgreSQL and Next.js containers', true, 'high', 'project', '2026-03-15', NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'Study group - algorithms', 'Meet with study group to review dynamic programming problems', false, 'medium', 'study', '2026-03-29', NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'Prepare presentation slides', 'Create 15 slides for CMPE 280 hackathon demo presentation', false, 'high', 'project', '2026-04-02', NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'Organize notes from lectures', 'Consolidate handwritten and digital notes from the past two weeks', false, 'low', 'study', '2026-03-31', NOW(), NOW(), 'demo-user-001');

-- ─── Assignments (15 items with varied grades) ──────────
INSERT INTO "Assignment" (id, title, subject, description, "dueDate", status, priority, grade, "createdAt", "updatedAt", "userId") VALUES
  (gen_random_uuid(), 'Linear Algebra Problem Set 5', 'Mathematics', 'Complete exercises 1-15 from chapter 8 on eigenvalues and eigenvectors', '2026-03-25', 'in-progress', 'high', NULL, NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'Physics Lab Report - Pendulum', 'Physics', 'Write lab report for pendulum experiment including error analysis and graphs', '2026-03-22', 'not-started', 'medium', NULL, NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'Essay on Renaissance Art', 'Art History', '2000 words on Italian Renaissance painters and their influence on modern art movements', '2026-03-28', 'completed', 'medium', 'A', NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'CMPE 280 Hackathon Project', 'Software Engineering', 'Build StudyPilot — an AI-powered study dashboard with voice assistant and full-stack architecture', '2026-04-05', 'in-progress', 'high', NULL, NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'Database Systems Homework 3', 'Computer Science', 'SQL query optimization, normalization to BCNF, and ER diagram exercises', '2026-03-26', 'not-started', 'medium', NULL, NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'Organic Chemistry Problem Set', 'Chemistry', 'Draw reaction mechanisms for SN1, SN2, E1, and E2 reactions with stereochemistry', '2026-03-20', 'completed', 'high', 'B+', NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'Operating Systems Project 2', 'Computer Science', 'Implement a multi-threaded web server with thread pooling in C', '2026-04-01', 'in-progress', 'high', NULL, NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'Macroeconomics Case Study', 'Economics', 'Analyze the 2008 financial crisis using IS-LM and AD-AS models', '2026-03-18', 'completed', 'low', 'A-', NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'Technical Writing Report', 'English', 'Write a 3000-word technical report on renewable energy technologies', '2026-03-30', 'not-started', 'medium', NULL, NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'Calculus III Homework 7', 'Mathematics', 'Double and triple integrals, change of variables, and Jacobian determinants', '2026-03-24', 'completed', 'high', 'A+', NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'Data Visualization Project', 'Computer Science', 'Create an interactive D3.js dashboard analyzing Bay Area housing data', '2026-04-03', 'in-progress', 'medium', NULL, NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'Philosophy Paper', 'Philosophy', 'Compare and contrast utilitarian and deontological ethics using real-world examples', '2026-03-15', 'completed', 'low', 'B', NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'Physics Problem Set 4', 'Physics', 'Electromagnetic waves, Maxwells equations, and wave optics problems', '2026-03-27', 'not-started', 'high', NULL, NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'Machine Learning Assignment 2', 'Computer Science', 'Implement gradient descent, logistic regression, and k-means clustering from scratch in Python', '2026-04-02', 'in-progress', 'high', NULL, NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'Statistics Midterm Review', 'Mathematics', 'Practice problems on hypothesis testing, confidence intervals, and regression analysis', '2026-03-19', 'completed', 'medium', 'A', NOW(), NOW(), 'demo-user-001');

-- ─── Calendar Events (25 items spanning multiple weeks) ──
INSERT INTO "calendar_events" (id, title, description, date, type, color, "createdAt", "updatedAt", "userId") VALUES
  -- Week of March 16-22
  (gen_random_uuid(), 'CMPE 280 Lecture', 'Advanced React patterns and server components', '2026-03-17 13:00:00', 'class', '#8b5cf6', NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'Chemistry Lab', 'Organic synthesis experiment - bring goggles and lab coat', '2026-03-17 14:30:00', 'class', '#3b82f6', NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'Study Group - Physics', 'Library Room 301 — practice electromagnetism problems', '2026-03-18 14:00:00', 'study', '#10b981', NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'Math Office Hours', 'Prof. Johnson — discuss eigenvalue decomposition', '2026-03-18 16:00:00', 'other', '#f59e0b', NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'CMPE 280 Lecture', 'State management and custom hooks deep dive', '2026-03-19 13:00:00', 'class', '#8b5cf6', NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'Physics Lecture', 'Electromagnetic induction and Faradays law', '2026-03-19 09:00:00', 'class', '#3b82f6', NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'Team Meeting - Hackathon', 'Sprint planning for StudyPilot voice assistant feature', '2026-03-20 18:00:00', 'study', '#6366f1', NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'Chemistry Lecture', 'Reaction kinetics and rate laws', '2026-03-20 10:30:00', 'class', '#3b82f6', NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'Calculus Recitation', 'TA session — practice integration by parts', '2026-03-21 11:00:00', 'class', '#8b5cf6', NOW(), NOW(), 'demo-user-001'),

  -- Week of March 23-29
  (gen_random_uuid(), 'Calculus Midterm', 'Covers chapters 1-8 — bring calculator, no notes allowed', '2026-03-24 09:00:00', 'exam', '#ef4444', NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'CMPE 280 Lecture', 'Full-stack deployment and Docker containerization', '2026-03-24 13:00:00', 'class', '#8b5cf6', NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'Chemistry Quiz', 'Organic chemistry nomenclature and reaction types', '2026-03-25 10:30:00', 'exam', '#ef4444', NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'Database Systems Lab', 'Hands-on SQL optimization and query planning', '2026-03-25 15:00:00', 'class', '#3b82f6', NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'Career Fair Prep Session', 'Resume review and mock interview practice at Career Center', '2026-03-26 12:00:00', 'other', '#f59e0b', NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'CMPE 280 Lecture', 'AI integration and streaming APIs', '2026-03-26 13:00:00', 'class', '#8b5cf6', NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'Physics Lab', 'Optics experiment — bring completed pre-lab', '2026-03-27 14:30:00', 'class', '#3b82f6', NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'Study Session - Algorithms', 'Prepare for coding interviews — dynamic programming focus', '2026-03-28 16:00:00', 'study', '#10b981', NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'CMPE 280 Midterm', 'Covers React, TypeScript, Next.js, and web design principles', '2026-03-28 13:00:00', 'exam', '#ef4444', NOW(), NOW(), 'demo-user-001'),

  -- Week of March 30 - April 5
  (gen_random_uuid(), 'CMPE 280 Lecture', 'Testing strategies and CI/CD pipelines', '2026-03-31 13:00:00', 'class', '#8b5cf6', NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'Research Paper Workshop', 'Writing center — peer review session for research papers', '2026-03-31 15:00:00', 'other', '#f59e0b', NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'Chemistry Midterm', 'Organic chemistry comprehensive exam', '2026-04-01 10:30:00', 'exam', '#ef4444', NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'Hackathon Demo Practice', 'Team run-through of StudyPilot presentation', '2026-04-02 17:00:00', 'study', '#6366f1', NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'CMPE 280 Lecture', 'Accessibility, performance optimization, and final project overview', '2026-04-02 13:00:00', 'class', '#8b5cf6', NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'Operating Systems Midterm', 'Process scheduling, memory management, and concurrency', '2026-04-03 09:00:00', 'exam', '#ef4444', NOW(), NOW(), 'demo-user-001'),
  (gen_random_uuid(), 'CMPE 280 Hackathon Demo Day', 'Present StudyPilot to class — 5 minute demo + 3 min Q&A', '2026-04-05 13:00:00', 'assignment', '#ef4444', NOW(), NOW(), 'demo-user-001');

-- ─── Conversations (5 conversations with messages) ──────
-- Conversation 1: Calculus help
WITH conv1 AS (
  INSERT INTO "Conversation" (id, title, "createdAt", "updatedAt", "userId")
  VALUES (gen_random_uuid(), 'Help with integration by parts', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', 'demo-user-001')
  RETURNING id
)
INSERT INTO "Message" (id, role, content, timestamp, "conversationId")
SELECT gen_random_uuid(), 'user', 'Can you help me understand integration by parts? I keep getting confused about which part to pick as u and which as dv.', NOW() - INTERVAL '3 days', id FROM conv1
UNION ALL
SELECT gen_random_uuid(), 'assistant', E'Of course! Integration by parts uses the formula: ∫u dv = uv - ∫v du\n\nThe key is choosing u and dv wisely. Use the **LIATE** rule to pick u (in order of preference):\n\n1. **L**ogarithmic functions (ln x)\n2. **I**nverse trig functions (arctan x)\n3. **A**lgebraic functions (x², x)\n4. **T**rigonometric functions (sin x, cos x)\n5. **E**xponential functions (eˣ)\n\nPick u from higher on the list, and dv from lower.\n\n**Example:** ∫x·eˣ dx\n- u = x (algebraic) → du = dx\n- dv = eˣ dx → v = eˣ\n- Result: xeˣ - ∫eˣ dx = xeˣ - eˣ + C\n\nWould you like me to walk through a harder example?', NOW() - INTERVAL '3 days' + INTERVAL '10 seconds', id FROM conv1
UNION ALL
SELECT gen_random_uuid(), 'user', 'Yes! Can you do one with ln(x)?', NOW() - INTERVAL '3 days' + INTERVAL '2 minutes', id FROM conv1
UNION ALL
SELECT gen_random_uuid(), 'assistant', E'Great choice! Let''s solve ∫ln(x) dx\n\nUsing LIATE, ln(x) is logarithmic so it should be u:\n- u = ln(x) → du = 1/x dx\n- dv = dx → v = x\n\nApplying the formula:\n∫ln(x) dx = x·ln(x) - ∫x · (1/x) dx\n= x·ln(x) - ∫1 dx\n= x·ln(x) - x + C\n\n**Tip:** Whenever you see a lonely ln(x) with nothing else, always make it u and let dv = dx. This trick works because differentiating ln(x) simplifies things, while integrating it directly is hard.\n\nWant to try ∫x²·ln(x) dx on your own? I can check your work!', NOW() - INTERVAL '3 days' + INTERVAL '2 minutes 15 seconds', id FROM conv1;

-- Conversation 2: Physics concepts
WITH conv2 AS (
  INSERT INTO "Conversation" (id, title, "createdAt", "updatedAt", "userId")
  VALUES (gen_random_uuid(), 'Electromagnetic induction explained', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', 'demo-user-001')
  RETURNING id
)
INSERT INTO "Message" (id, role, content, timestamp, "conversationId")
SELECT gen_random_uuid(), 'user', 'What is Faraday''s law and how does it relate to electromagnetic induction?', NOW() - INTERVAL '2 days', id FROM conv2
UNION ALL
SELECT gen_random_uuid(), 'assistant', E'**Faraday''s Law** states that a changing magnetic flux through a circuit induces an electromotive force (EMF):\n\n**EMF = -dΦ/dt**\n\nWhere Φ (phi) is the magnetic flux = B · A · cos(θ)\n\n**Key concepts:**\n- **Magnetic flux** (Φ) depends on field strength (B), area (A), and angle (θ)\n- **Induced EMF** is proportional to the *rate of change* of flux\n- The negative sign (Lenz''s law) means the induced current opposes the change\n\n**Real-world examples:**\n- Electric generators: rotating coils in magnetic fields\n- Transformers: changing current in one coil induces current in another\n- Wireless phone chargers: alternating magnetic field induces current\n\nThe faster the flux changes, the larger the induced voltage. This is why generators spin faster to produce more electricity!\n\nShall I work through a numerical problem?', NOW() - INTERVAL '2 days' + INTERVAL '12 seconds', id FROM conv2;

-- Conversation 3: Study strategies
WITH conv3 AS (
  INSERT INTO "Conversation" (id, title, "createdAt", "updatedAt", "userId")
  VALUES (gen_random_uuid(), 'Study strategies for midterms', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', 'demo-user-001')
  RETURNING id
)
INSERT INTO "Message" (id, role, content, timestamp, "conversationId")
SELECT gen_random_uuid(), 'user', 'I have 3 midterms next week — calculus, chemistry, and CMPE 280. How should I plan my study time?', NOW() - INTERVAL '1 day', id FROM conv3
UNION ALL
SELECT gen_random_uuid(), 'assistant', E'Here''s a strategic study plan for your 3 midterms:\n\n**Priority Assessment:**\n1. **Calculus** (hardest, most content) — needs the most time\n2. **Chemistry** (moderate difficulty) — focus on mechanisms\n3. **CMPE 280** (practical, project-based) — review concepts and code\n\n**Recommended Schedule:**\n\n**5 days before:** Start with calculus. Review integration techniques, practice 10 problems per chapter. Use active recall (close the book, solve from memory).\n\n**4 days before:** Morning — calculus problems. Afternoon — start chemistry review. Make flashcards for reaction mechanisms.\n\n**3 days before:** Alternate between calculus and chemistry. Do practice exams under timed conditions.\n\n**2 days before:** Focus on CMPE 280 — review React hooks, TypeScript patterns, and your project architecture. Re-read lecture slides.\n\n**1 day before:** Light review only! Skim notes, do a few easy problems for confidence. Get 8 hours of sleep.\n\n**Pro tips:**\n- Use the Pomodoro technique: 25 min study, 5 min break\n- Teach concepts out loud (even to yourself)\n- Focus on weak areas, not what you already know\n- Stay hydrated and take walks between sessions\n\nWant me to generate a more detailed hour-by-hour schedule?', NOW() - INTERVAL '1 day' + INTERVAL '15 seconds', id FROM conv3
UNION ALL
SELECT gen_random_uuid(), 'user', 'That''s really helpful! Can you help me understand React hooks for the CMPE 280 exam?', NOW() - INTERVAL '1 day' + INTERVAL '5 minutes', id FROM conv3
UNION ALL
SELECT gen_random_uuid(), 'assistant', E'Absolutely! Here''s a concise review of React hooks for your exam:\n\n**Core Hooks:**\n\n1. **useState** — Manages local component state\n```\nconst [count, setCount] = useState(0);\n```\n\n2. **useEffect** — Side effects (API calls, subscriptions)\n```\nuseEffect(() => {\n  fetchData();\n  return () => cleanup(); // cleanup on unmount\n}, [dependency]); // runs when dependency changes\n```\n\n3. **useCallback** — Memoizes functions to prevent unnecessary re-renders\n```\nconst handleClick = useCallback(() => {\n  doSomething(id);\n}, [id]); // only recreated when id changes\n```\n\n4. **useMemo** — Memoizes computed values\n```\nconst filtered = useMemo(() => {\n  return items.filter(i => i.active);\n}, [items]);\n```\n\n5. **useRef** — Persists values without re-rendering\n```\nconst inputRef = useRef(null);\ninputRef.current.focus();\n```\n\n6. **useContext** — Access context values without prop drilling\n```\nconst theme = useContext(ThemeContext);\n```\n\n**Key exam tips:**\n- useState triggers re-renders, useRef does not\n- useEffect cleanup runs before the next effect and on unmount\n- Empty dependency array [] = runs once on mount\n- useCallback is for functions, useMemo is for values\n\nWant me to quiz you on these?', NOW() - INTERVAL '1 day' + INTERVAL '5 minutes 20 seconds', id FROM conv3;

-- Conversation 4: Database design
WITH conv4 AS (
  INSERT INTO "Conversation" (id, title, "createdAt", "updatedAt", "userId")
  VALUES (gen_random_uuid(), 'SQL normalization help', NOW() - INTERVAL '5 hours', NOW() - INTERVAL '5 hours', 'demo-user-001')
  RETURNING id
)
INSERT INTO "Message" (id, role, content, timestamp, "conversationId")
SELECT gen_random_uuid(), 'user', 'Can you explain the difference between 2NF and 3NF?', NOW() - INTERVAL '5 hours', id FROM conv4
UNION ALL
SELECT gen_random_uuid(), 'assistant', E'Great question! Let me break down the normal forms:\n\n**2NF (Second Normal Form):**\n- Must be in 1NF (no repeating groups)\n- Every non-key attribute must depend on the **entire** primary key\n- Only matters for composite keys\n\n**Example violation:** Table with composite key (StudentID, CourseID)\n- StudentName depends only on StudentID, not the full key → violates 2NF\n- Fix: Split into separate Students and Enrollments tables\n\n**3NF (Third Normal Form):**\n- Must be in 2NF\n- No **transitive dependencies** — non-key attributes can''t depend on other non-key attributes\n\n**Example violation:**\n- StudentID → DepartmentID → DepartmentName\n- DepartmentName transitively depends on StudentID through DepartmentID → violates 3NF\n- Fix: Create a separate Departments table\n\n**Quick memory trick:**\n- 2NF: "The whole key" (full dependency on primary key)\n- 3NF: "Nothing but the key" (no transitive deps)\n- Together: "The key, the whole key, and nothing but the key!"\n\nWant me to walk through a normalization exercise?', NOW() - INTERVAL '5 hours' + INTERVAL '10 seconds', id FROM conv4;

-- Conversation 5: Recent coding help
WITH conv5 AS (
  INSERT INTO "Conversation" (id, title, "createdAt", "updatedAt", "userId")
  VALUES (gen_random_uuid(), 'Docker Compose setup help', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour', 'demo-user-001')
  RETURNING id
)
INSERT INTO "Message" (id, role, content, timestamp, "conversationId")
SELECT gen_random_uuid(), 'user', 'How do I set up Docker Compose for a Next.js app with PostgreSQL?', NOW() - INTERVAL '1 hour', id FROM conv5
UNION ALL
SELECT gen_random_uuid(), 'assistant', E'Here''s how to set up Docker Compose for Next.js + PostgreSQL:\n\n**docker-compose.yml:**\n```yaml\nservices:\n  db:\n    image: postgres:16-alpine\n    environment:\n      POSTGRES_USER: myapp\n      POSTGRES_PASSWORD: secret\n      POSTGRES_DB: myapp\n    ports:\n      - "5432:5432"\n    volumes:\n      - pgdata:/var/lib/postgresql/data\n    healthcheck:\n      test: ["CMD-SHELL", "pg_isready -U myapp"]\n      interval: 5s\n      retries: 5\n\n  app:\n    build: .\n    ports:\n      - "3000:3000"\n    environment:\n      DATABASE_URL: postgresql://myapp:secret@db:5432/myapp\n    depends_on:\n      db:\n        condition: service_healthy\n\nvolumes:\n  pgdata:\n```\n\n**Key points:**\n- Use `depends_on` with `condition: service_healthy` so the app waits for the DB\n- The hostname inside Docker is the service name (`db`), not `localhost`\n- Use a named volume (`pgdata`) so data persists across restarts\n- Health checks ensure the database is ready before the app starts\n\n**Commands:**\n```bash\ndocker compose up db -d     # Start just the database\ndocker compose up --build   # Build and start everything\ndocker compose down -v      # Stop and remove volumes (fresh start)\n```\n\nWant me to help with the Dockerfile too?', NOW() - INTERVAL '1 hour' + INTERVAL '12 seconds', id FROM conv5
UNION ALL
SELECT gen_random_uuid(), 'user', 'Yes please! Show me a multi-stage Dockerfile for Next.js.', NOW() - INTERVAL '1 hour' + INTERVAL '3 minutes', id FROM conv5
UNION ALL
SELECT gen_random_uuid(), 'assistant', E'Here''s an optimized multi-stage Dockerfile for Next.js:\n\n```dockerfile\n# Stage 1: Install dependencies\nFROM node:20-alpine AS deps\nWORKDIR /app\nCOPY package.json package-lock.json ./\nRUN npm ci\n\n# Stage 2: Build the application\nFROM node:20-alpine AS builder\nWORKDIR /app\nCOPY --from=deps /app/node_modules ./node_modules\nCOPY . .\nRUN npm run build\n\n# Stage 3: Production runner\nFROM node:20-alpine AS runner\nWORKDIR /app\nENV NODE_ENV=production\n\n# Create non-root user for security\nRUN addgroup -S nodejs && adduser -S nextjs -G nodejs\n\n# Copy only what''s needed\nCOPY --from=builder /app/.next/standalone ./\nCOPY --from=builder /app/.next/static ./.next/static\nCOPY --from=builder /app/public ./public\n\nUSER nextjs\nEXPOSE 3000\nCMD ["node", "server.js"]\n```\n\n**Why multi-stage?**\n- **Stage 1 (deps):** Cached separately — only reruns when package.json changes\n- **Stage 2 (builder):** Full build with all dev dependencies\n- **Stage 3 (runner):** Only production files — image is ~150MB instead of ~1GB\n\n**Important:** Set `output: "standalone"` in next.config.ts for this to work!\n\nThis gives you a lean, secure production image. The non-root user prevents container escape attacks.', NOW() - INTERVAL '1 hour' + INTERVAL '3 minutes 15 seconds', id FROM conv5;
