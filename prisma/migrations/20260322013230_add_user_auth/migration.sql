-- Migration: Add User authentication model and userId relations
-- This migration clears existing seed data (no userId) and re-creates with proper relations

-- Step 1: Clear existing data that lacks userId
DELETE FROM "Message";
DELETE FROM "Conversation";
DELETE FROM "calendar_events";
DELETE FROM "Assignment";
DELETE FROM "Todo";

-- Step 2: Create User table
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- Step 3: Add userId columns to existing tables
ALTER TABLE "Todo" ADD COLUMN "userId" TEXT NOT NULL;
ALTER TABLE "Assignment" ADD COLUMN "userId" TEXT NOT NULL;
ALTER TABLE "calendar_events" ADD COLUMN "userId" TEXT NOT NULL;
ALTER TABLE "Conversation" ADD COLUMN "userId" TEXT NOT NULL;

-- Step 4: Create indexes for fast user-scoped queries
CREATE INDEX "Todo_userId_idx" ON "Todo"("userId");
CREATE INDEX "Assignment_userId_idx" ON "Assignment"("userId");
CREATE INDEX "calendar_events_userId_idx" ON "calendar_events"("userId");
CREATE INDEX "Conversation_userId_idx" ON "Conversation"("userId");

-- Step 5: Add foreign key constraints with cascade delete
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "calendar_events" ADD CONSTRAINT "calendar_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
