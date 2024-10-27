"use server";

import { db } from "@/db";
import { quizSubmissions } from "@/db/schema";
import { auth } from "@/auth";
import { InferInsertModel, eq } from "drizzle-orm";
import { pgEnum } from "drizzle-orm/pg-core";

type Submission = InferInsertModel<typeof quizSubmissions>; //this command needs an update. checked website and it didn't work npx drizzle-kit push:pg
export async function saveSubmission(sub: Submission, quizId: number) {
  const { score } = sub;
  const session = await auth();
  // const userId = session?.user?.id;

  const newSubmission = await db
    .insert(quizSubmissions)
    .values({
      score,
      quizId,
    })
    .returning({ insertedId: quizSubmissions.id });
  const submissionId = newSubmission[0].insertedId;
  return submissionId;
}
