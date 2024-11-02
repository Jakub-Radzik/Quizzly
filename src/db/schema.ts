import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  serial,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  stripeCustomerId: text("stripe_customer_id"),
  subscribed: boolean("subscribed"),
});

export const userRelations = relations(users, ({ many }) => ({
  quizzes: many(quizzes),
  submissions: many(quizSubmissions),
}));

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verficationToken) => ({
    compositePk: primaryKey({
      columns: [verficationToken.identifier, verficationToken.token],
    }),
  })
);

export const authenticators = pgTable(
  "authenticator",
  {
    credential_id: text("credential_id").notNull().unique(),
    user_id: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.user_id, authenticator.credential_id],
    }),
  })
);

export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  name: text("name"),
  description: text("description"),
  userId: text("user_id").references(() => users.id),
  sourceDocumentId: text("sourceDocumentId"),
  sourceDocumentAlias: text("sourceDocumentAlias"),
});

export const quizzesRelations = relations(quizzes, ({ many, one }) => ({
  questions: many(questions),
  submissions: many(quizSubmissions),
}));

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  questionText: text("question_text"),
  quizId: integer("quiz_id"),
});

export const questionsRelations = relations(questions, ({ one, many }) => ({
  quiz: one(quizzes, {
    fields: [questions.quizId],
    references: [quizzes.id],
  }),
  answers: many(questionAnswers),
}));

export const questionAnswers = pgTable("answers", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id"),
  answerText: text("answer_text"),
  isCorrect: boolean("is_correct"),
});

export const questionAnswerRelations = relations(
  questionAnswers,
  ({ one }) => ({
    question: one(questions, {
      fields: [questionAnswers.questionId],
      references: [questions.id],
    }),
  })
);

export const quizSubmissions = pgTable("quiz_submissions", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").references(() => quizzes.id),
  userId: text("user_id").references(() => users.id),
  score: integer("score"),
  attemptNumber: integer("attempt_number").default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const quizSubmissionsRelations = relations(
  quizSubmissions,
  ({ one }) => ({
    quiz: one(quizzes, {
      fields: [quizSubmissions.quizId],
      references: [quizzes.id],
    }),
    user: one(users, {
      fields: [quizSubmissions.userId],
      references: [users.id],
    }),
  })
);
