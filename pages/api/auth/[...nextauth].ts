import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { NextApiRequest, NextApiResponse } from 'next';


const adminEmails = ['contacto.photolozano@gmail.com', 'lozanobarrioseloy@gmail.com', 'wilsonmaxx2402@gmail.com'];

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET, // Asegurar que está definido en el .env
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: async ({ session }) => {
      if (!session?.user?.email || !adminEmails.includes(session.user.email)) {
        throw new Error("Not an admin"); // Forzar cierre de sesión si no es admin
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);

export async function isAdminRequest(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  const email = session?.user?.email;

  if (!email || !adminEmails.includes(email)) {
    res.status(401).end();
    throw new Error("Not an admin");
  }
}
