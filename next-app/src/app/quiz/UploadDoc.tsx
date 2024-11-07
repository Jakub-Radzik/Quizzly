"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileUpload } from "@/components/ui/file-upload";

const UploadDoc = ({ userId }: { userId: string }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = (files: File[]) => {
    setFiles(files);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const document = files[0];

    if (!document) {
      setError("Please upload a document first");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("pdf", document as Blob);

    try {
      const res = await fetch("/api/quiz/generate", {
        method: "POST",
        body: formData,
        headers: {
          userId,
        },
      });

      if (res.status === 200) {
        const data = await res.json();
        const quizId = data.quizId;
        router.push(`/quiz/${quizId}`);
      }
    } catch (e) {
      console.log("Oops, there was an error while generating the quiz", e);
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
            <FileUpload onChange={handleFileUpload} />
          </div>
          {error && <p className="text-red-600">{error}</p>}
          <button
            type="submit"
            className="inline-flex mt-5 h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
          >
            Generate Quiz
          </button>
        </form>
      )}
    </div>
  );
};

export default UploadDoc;
