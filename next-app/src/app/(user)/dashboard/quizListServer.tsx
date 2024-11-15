import { db } from "@/db";
import { questions, quizSubmissions, quizzes, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import QuizList from "./quizList";

const QuizListServer = async () => {
  const result = await db
    .select()
    .from(quizzes)
    .leftJoin(quizSubmissions, eq(quizSubmissions.quizId, quizzes.id))
    .leftJoin(users, eq(users.id, quizSubmissions.userId));

  const questionsForQuiz = await db
    .select()
    .from(quizzes)
    .leftJoin(questions, eq(questions.quizId, quizzes.id));

  const quizMap = new Map<string, { quiz: any; submissions: any[] }>();

  result.forEach((item) => {
    const quizId = item.quizzes.id;

    if (!quizMap.has(quizId)) {
      quizMap.set(quizId, {
        quiz: {
          id: quizId,
          name: item.quizzes.name,
          description: item.quizzes.description,
          questionCount: questionsForQuiz.filter(
            (elem) => elem.quizzes.id === quizId
          ).length,
        },
        submissions: [],
      });
    }

    if (item.quiz_submissions) {
      quizMap.get(quizId)?.submissions.push({
        id: item.quiz_submissions.id,
        userName: item.user?.name,
        score: item.quiz_submissions.score,
        attemptNumber: item.quiz_submissions.attemptNumber,
        createdAt: item.quiz_submissions.createdAt,
      });
    }
  });

  return <QuizList quizzes={[...quizMap.values()]} />;
};

export default QuizListServer;
