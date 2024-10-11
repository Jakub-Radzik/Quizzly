import { NextRequest, NextResponse } from "next/server";

import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";

import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";

import saveQuiz from "./saveToDb";

export async function POST(req: NextRequest) {
  const body = await req.formData();
  const document = body.get("pdf");
  console.log("got pdf");

  try {
    const pdfLoader = new PDFLoader(document as Blob, {
      parsedItemSeparator: " ",
    });
    const docs = await pdfLoader.load();
    console.log("loaded pdf");

    const selectedDocuments = docs.filter(
      (doc) => doc.pageContent !== undefined
    );
    console.log("filtered docs");

    const texts = selectedDocuments.map((doc) => doc.pageContent);
    console.log(texts);

    const prompt =
      "given the text which is a summar of the document, generate a quiz based on the text. Return json only that contains a quiz object with fields: name, description, and questions. The questions is an array of object with fields: questionText, answers. The answers is an array of objects with fields: answerText, isCorrect.";

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not provided" },
        { status: 500 }
      );
    }
    console.log("have openAI key");

    const model = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-4-1106-preview",
    });

    const parser = new JsonOutputFunctionsParser();
    const extractionFunctionSchema = {
      name: "extractor",
      description: "Extracts fields from output",
      parameters: {
        type: "object",
        properties: {
          quiz: {
            type: "object",
            properties: {
              name: { type: "string" },
              description: { type: "string" },
              questions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    questionText: { type: "string" },
                    answers: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          answerText: { type: "string" },
                          isCorrect: { type: "boolean" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    };

    const runnable = model
      .bind({
        functions: [extractionFunctionSchema],
        function_call: { name: "extractor" },
      })
      .pipe(parser);
    console.log("bind and pipe");

    const message = new HumanMessage({
      content: [
        {
          type: "text",
          text: prompt + "\n" + texts.join("\n"),
        },
      ],
    });

    const result = await runnable.invoke([message]);
    console.log(result);

    const { quizId } = await saveQuiz(result.quiz);

    return NextResponse.json({ quizId }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// export { GET, POST } from "@/auth";
