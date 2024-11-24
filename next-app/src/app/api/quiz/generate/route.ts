import { NextRequest, NextResponse } from "next/server";

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

import saveQuiz from "./saveToDb";
import saveToS3 from "./saveToS3";

type Quiz = {
  name: string;
  description: string;
  questions: Array<{
    questionText: string;
    answers: Array<{
      answerText: string;
      isCorrect: boolean;
    }>;
  }>;
};

export async function POST(req: NextRequest) {
  const body = await req.formData();
  const userId = req.headers.get("userId");

  if (!userId) {
    throw new Error("Session was not found! Cant generate quiz");
  }

  const document = body.get("pdf");
  console.log("got pdf");

  try {
    // Load the PDF document
    // ----------------------------------------------------------------------------
    const pdfLoader = new PDFLoader(document as Blob, {
      parsedItemSeparator: " ",
    });
    const docs = await pdfLoader.load();
    console.log("loaded pdf");

    // Save the document to S3
    // ----------------------------------------------------------------------------
    const { file_id, file_name, error } = await saveToS3(document as File);
    if (error || !file_id || !file_name) {
      return NextResponse.json({ error }, { status: 500 });
    }
    // const file_id = "file_id";
    // const file_name = "file_name";
    console.log("saved to s3");

    // Extract the text from the document
    // ----------------------------------------------------------------------------
    const selectedDocuments = docs.filter(
      (doc) => doc.pageContent !== undefined
    );
    console.log("filtered docs");

    const texts = selectedDocuments.map((doc) => doc.pageContent);
    console.log(texts);

    console.log("before lambda");
    // Generate the quiz using AWS Lambda
    // ----------------------------------------------------------------------------
    const lambdaUrl = process.env.LAMBDA_URL;
    const lambdaSecret = process.env.LAMBDA_SECRET;
    if (!lambdaUrl || !lambdaSecret) {
      return NextResponse.json(
        { error: "Lambda URL or secret not provided" },
        { status: 500 }
      );
    }
    console.log("have lambda url and secret");

    const res = await fetch(lambdaUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        secret: lambdaSecret,
        documentId: file_id,
      }),
    });
    const result = await res.json();
    console.log(result);

    // Save the quiz to the database
    // ----------------------------------------------------------------------------
    console.log("before save quiz");
    // result, file_id, file_name
    const { quizId } = await saveQuiz({
      quizData: result,
      userId,
      file_id,
      file_name,
    });
    console.log("saved quiz");

    return NextResponse.json({ quizId }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
