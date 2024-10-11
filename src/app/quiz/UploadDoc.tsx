"use client";
import { useState } from "react"; // Corrected import statement
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const UploadDoc = () => {
  const [document, setDocument] = useState<Blob | File | null | undefined>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const router = useRouter(); // Correct usage of useRouter

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("prevented default")

    if (!document) {
      setError("Please upload a document first");
      return;
    }
    console.log("document no error")

    setIsLoading(true);
    const formData = new FormData();
    formData.append("pdf", document as Blob);
    console.log("appended pdf")

    try {
      const res = await fetch("/api/quiz/generate", {
        method: "POST",
        body: formData,
      });
      console.log("posted")

      if (res.status === 200) {
        const data = await res.json();
        const quizId = data.quizId;
        console.log(`quiz/${quizId}`);
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
        <form
          className="w-full"
          onSubmit={handleSubmit}
        >
          <label
            htmlFor="document"
            className="bg-secondary w-full flex h-20 rounded-md border-4 border-dashed border-blue-900 relative"
          >
            <div className="absolute inset-0 m-auto flex justify-center items-center">
              {document && document.name ? document.name : "Drag a file here"}
            </div>
            <input
              type="file"
              id="document"
              className="relative block w-full h-full z-50 opacity-0"
              onChange={(e) => setDocument(e?.target?.files?.[0])}
            />
          </label>
          {error && <p className="text-red-600">{error}</p>}
          <Button
            size="lg"
            className="mt-2"
            type="submit"
          >
            Generate Quiz
          </Button>
        </form>
      )}
    </div>
  );
};

export default UploadDoc;
