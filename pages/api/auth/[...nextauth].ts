import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
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
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Verificar las credenciales
        if (credentials?.username === "admin" && credentials?.password === "admin") {
          // Retornar un objeto de usuario simulado
          return { id: "1", name: "Admin", email: "admin@example.com" };
        }
        return null; // Credenciales incorrectas
      },
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
  pages: {
    signIn: "/auth/signin", // Página personalizada de inicio de sesión (opcional)
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