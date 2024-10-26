import React from 'react' // Add this if it's not globally available in your project
import { db } from '@/db'
import { quizzes } from '@/db/schema'
import { eq } from 'drizzle-orm'
import QuizQuestions from '../QuizQuestions' // Make sure this is used or remove it if not necessary

const page = async ({
  params,
}: {
  params: {
    quizID: string
  }
}) => {
  const quizId = params.quizID

  if (!quizId) {
    return <div>Quiz ID is missing.</div>
  }

  const quiz = await db.query.quizzes.findFirst({
    where: eq(quizzes.id, parseInt(quizId)),
    with: {
      questions: {
        with: {
          answers: true,
        },
      },
    },
  })

  console.log(quiz)

  if (!quizId || !quiz || quiz.questions.length === 0) {
    return <div>Quiz not found.</div>
  }

  return <QuizQuestions quiz={quiz} />
}

export default page
