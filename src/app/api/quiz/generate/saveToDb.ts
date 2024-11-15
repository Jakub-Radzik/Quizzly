import { db } from "@/db";
import {
  quizzes,
  questions as dbQuestions,
  questionAnswers,
} from "@/db/schema";
import { InferInsertModel } from "drizzle-orm";

type Quiz = InferInsertModel<typeof quizzes>;
type Question = InferInsertModel<typeof dbQuestions>;
type Answer = InferInsertModel<typeof questionAnswers>;
interface SaveQuizData extends Quiz {
  questions: Array<Question & { answers?: Answer[] }>;
}

interface saveQuizPayload {
  quizData: SaveQuizData;
  userId: string;
  file_id: string;
  file_name: string;
}

export default async function saveQuiz({
  quizData,
  userId,
  file_id,
  file_name,
}: saveQuizPayload) {
  const { name, description, questions } = quizData;

  const newQuizz = await db
    .insert(quizzes)
    .values({
      name,
      description,
      sourceDocumentId: file_id,
      sourceDocumentAlias: file_name,
      userId,
    })
    .returning({ insertedId: quizzes.id });

  const quizId = newQuizz[0].insertedId;

  await db.transaction(async (tx) => {
    for (const question of questions) {
      const [{ questionId }] = await tx
        .insert(dbQuestions)
        .values({
          questionText: question.questionText,
          quizId,
        })
        .returning({ questionId: dbQuestions.id });

      if (question.answers && question.answers.length > 0) {
        await tx.insert(questionAnswers).values(
          question.answers.map((answer) => ({
            answerText: answer.answerText,
            isCorrect: answer.isCorrect,
            questionId,
          }))
        );
      }
    }
  });

  return { quizId };
}
