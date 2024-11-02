import { auth } from "@/auth";
import UploadDoc from "../UploadDoc";

const page = async () => {
  const session = await auth();

  const userId = session?.user?.id;

  return (
    <div className="flex flex-col flex-1">
      <main className="py-11 flex flex-col text-center gap-4 items-center flex-1 mt-24">
        <h2 className="text-3xl font-bold mb-4">
          what type of quiz would you like to work on today?
        </h2>
        {userId ? <UploadDoc userId={userId} /> : <p>user was not found</p>}
      </main>
    </div>
  );
};

export default page;
