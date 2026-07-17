// src/db/schema.ts
import { pgTable, text, timestamp, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['user', 'moderator', 'admin']);
export const workStatusEnum = pgEnum('work_status', ['student', 'job_holder']);
export const verificationStatusEnum = pgEnum('verification_status', ['pending', 'approved', 'rejected']);
export const reportStatusEnum = pgEnum('report_status', ['pending', 'reviewed', 'dismissed']);

// Users table
export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  profilePicture: text('profile_picture').notNull().default('https://img.freepik.com/premium-vector/man-avatar-profile-picture-isolated-background-avatar-profile-picture-man_1293239-4866.jpg?semt=ais_hybrid&w=740&q=80'),
  role: userRoleEnum('role').notNull().default('user'),
  isVerified: boolean('is_verified').notNull().default(false),
  emailVerified: boolean('email_verified').notNull().default(false), // NEW: Email verification status
  lastActiveAt: timestamp('last_active_at').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Email Verification Codes table - NEW
export const emailVerificationCodes = pgTable('email_verification_codes', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull(),
  code: text('code').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Password Reset Tokens table - NEW
export const passwordResetTokens = pgTable('password_reset_tokens', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Verification details table
export const verificationDetails = pgTable('verification_details', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  university: text('university').notNull(),
  workStatus: workStatusEnum('work_status').notNull(),
  location: text('location').notNull(),
  socialMediaLinks: text('social_media_links'),
  mobileNumber: text('mobile_number').notNull(),
  status: verificationStatusEnum('status').notNull().default('pending'),
  reviewedBy: text('reviewed_by').references(() => users.id),
  reviewedAt: timestamp('reviewed_at'),
  rejectionReason: text('rejection_reason'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Fields table
export const fields = pgTable('fields', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Categories table
export const categories = pgTable('categories', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  description: text('description'),
  fieldId: text('field_id').notNull().references(() => fields.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Questions table
export const questions = pgTable('questions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  questionText: text('question_text').notNull(),
  answer: text('answer').notNull(),
  categoryId: text('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Likes table
export const likes = pgTable('likes', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  questionId: text('question_id').notNull().references(() => questions.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Reports table
export const reports = pgTable('reports', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  questionId: text('question_id').notNull().references(() => questions.id, { onDelete: 'cascade' }),
  reportedBy: text('reported_by').notNull().references(() => users.id, { onDelete: 'cascade' }),
  reason: text('reason').notNull(),
  status: reportStatusEnum('status').notNull().default('pending'),
  reviewedBy: text('reviewed_by').references(() => users.id),
  reviewedAt: timestamp('reviewed_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Connections table
export const connections = pgTable('connections', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  connectedUserId: text('connected_user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  status: text('status').notNull().default('pending'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Messages table
export const messages = pgTable('messages', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  senderId: text('sender_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  receiverId: text('receiver_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  isRead: boolean('is_read').notNull().default(false),
  deliveredAt: timestamp('delivered_at'),
  readAt: timestamp('read_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  verificationDetails: one(verificationDetails, {
    fields: [users.id],
    references: [verificationDetails.userId],
  }),
  questions: many(questions),
  likes: many(likes),
  reports: many(reports),
  sentMessages: many(messages, { relationName: 'sentMessages' }),
  receivedMessages: many(messages, { relationName: 'receivedMessages' }),
  connections: many(connections, { relationName: 'userConnections' }),
  connectedTo: many(connections, { relationName: 'connectedToUser' }),
  passwordResetTokens: many(passwordResetTokens),
}));

export const verificationDetailsRelations = relations(verificationDetails, ({ one }) => ({
  user: one(users, {
    fields: [verificationDetails.userId],
    references: [users.id],
  }),
  reviewer: one(users, {
    fields: [verificationDetails.reviewedBy],
    references: [users.id],
  }),
}));

export const passwordResetTokensRelations = relations(passwordResetTokens, ({ one }) => ({
  user: one(users, {
    fields: [passwordResetTokens.userId],
    references: [users.id],
  }),
}));

export const fieldsRelations = relations(fields, ({ many }) => ({
  categories: many(categories),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  field: one(fields, {
    fields: [categories.fieldId],
    references: [fields.id],
  }),
  questions: many(questions),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  category: one(categories, {
    fields: [questions.categoryId],
    references: [categories.id],
  }),
  user: one(users, {
    fields: [questions.userId],
    references: [users.id],
  }),
  likes: many(likes),
  reports: many(reports),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  question: one(questions, {
    fields: [likes.questionId],
    references: [questions.id],
  }),
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  question: one(questions, {
    fields: [reports.questionId],
    references: [questions.id],
  }),
  reportedByUser: one(users, {
    fields: [reports.reportedBy],
    references: [users.id],
  }),
  reviewer: one(users, {
    fields: [reports.reviewedBy],
    references: [users.id],
  }),
}));

export const connectionsRelations = relations(connections, ({ one }) => ({
  user: one(users, {
    fields: [connections.userId],
    references: [users.id],
    relationName: 'userConnections',
  }),
  connectedUser: one(users, {
    fields: [connections.connectedUserId],
    references: [users.id],
    relationName: 'connectedToUser',
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: 'sentMessages',
  }),
  receiver: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
    relationName: 'receivedMessages',
  }),
}));