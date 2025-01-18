"use server";

import { db } from "@/db";
import { quizSubmissions } from "@/db/schema";
import { auth } from "@/auth";
import { InferInsertModel, and, eq } from "drizzle-orm";

type Submission = InferInsertModel<typeof quizSubmissions>;
export async function saveSubmission(sub: Submission, quizId: string) {
  const { score } = sub;
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("user was not found");
  }

  const submissionCount = await db.query.quizSubmissions.findMany({
    where: and(
      eq(quizSubmissions.quizId, quizId),
      eq(quizSubmissions.userId, userId)
    ),
  });

  const newSubmission = await db
    .insert(quizSubmissions)
    .values({
      score,
      quizId,
      userId,
      attemptNumber: submissionCount.length + 1,
    })
    .returning({ insertedId: quizSubmissions.id });
  const submissionId = newSubmission[0].insertedId;
  return submissionId;
}
