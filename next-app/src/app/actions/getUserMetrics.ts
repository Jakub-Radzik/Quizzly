import { quizzes, questions, quizSubmissions, users } from "@/db/schema";
import { auth } from "@/auth";
import { db } from "@/db";
import { count, eq, avg } from "drizzle-orm";

const getUserMetrics = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return;
  }

  // get total # of user quizzes
  const numQuizzes = await db
    .select({ value: count() })
    .from(quizzes)
    .where(eq(quizzes.userId, userId));

  // get total # of questions
  const numQuestions = await db
    .select({ value: count() })
    .from(questions)
    .innerJoin(quizzes, eq(questions.quizId, quizzes.id))
    .innerJoin(users, eq(quizzes.userId, users.id))
    .where(eq(users.id, userId));

  // get total # of submissions
  const numSubmissions = await db
    .select({ value: count() })
    .from(quizSubmissions)
    .innerJoin(quizzes, eq(quizSubmissions.quizId, quizzes.id))
    .innerJoin(users, eq(quizzes.userId, users.id))
    .where(eq(users.id, userId));

  // get average score
  const avgScore = await db
    .select({ value: avg(quizSubmissions.score) })
    .from(quizSubmissions)
    .innerJoin(quizzes, eq(quizSubmissions.quizId, quizzes.id))
    .innerJoin(users, eq(quizzes.userId, users.id))
    .where(eq(users.id, userId));

  return [
    { label: "# of quizzes", value: numQuizzes[0].value },
    { label: "# of questions", value: numQuestions[0].value },
    { label: "# of submissions", value: numSubmissions[0].value },
    { label: "average score", value: avgScore[0].value },
  ];
};

export default getUserMetrics;
