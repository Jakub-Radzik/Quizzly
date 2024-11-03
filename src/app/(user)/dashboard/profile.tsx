import { auth } from "@/auth";
import Image from "next/image";

const ProfileCard = async () => {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return <p>No user logged in.</p>;
  }

  return (
    <div className="flex flex-row items-center rounded-lg shadow-md mt-8 mb-5">
      <div className="w-24 h-24 rounded-full overflow-hidden">
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name ?? "alt text"}
            width={100}
            height={100}
            className="rounded-full"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-2xl text-gray-500">?</span>
          </div>
        )}
      </div>
      <div className="mt-4 ml-5">
        <h1 className="text-xl font-semibold">{user.name}</h1>
        <p className="text-gray-500">{user.email}</p>
      </div>
    </div>
  );
};

export default ProfileCard;
