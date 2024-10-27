import { quizzes, questions, quizSubmissions, users } from "@/db/schema";
import { auth } from "@/auth";
import { db } from "@/db";
import { count, eq, avg, sql } from "drizzle-orm";

const getHeatMapData = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return;
  }

  const data = await db
    .select({
      createdAt: quizSubmissions.createdAt,
      count: sql<number>`cast(count(${quizSubmissions.id}) as int)`,
    })
    .from(quizSubmissions)
    .innerJoin(quizzes, eq(quizSubmissions.quizId, quizzes.id))
    .innerJoin(users, eq(quizzes.userId, users.id))
    .groupBy(quizSubmissions.createdAt);

  return { data };
};

export default getHeatMapData;
