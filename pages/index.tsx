import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const userImage = session?.user?.image ?? "/default-avatar.jpg"; // Usa una imagen por defecto si no hay una en la sesión

  console.log({ session });

  return (
    <Layout>
      <div className="text-blue-900 flex justify-between">
        <h2>
          Hello, <b>{session?.user?.name}</b>
        </h2>

        <div className="flex bg-gray-300 text-black gap-1 rounded-lg overflow-hidden h-min">
          <img src={userImage} alt="User mail image" className="w-6 h-6 " />
          <span className="px-2">{session?.user?.name}</span>
        </div>
      </div>
    </Layout>
  );
}
