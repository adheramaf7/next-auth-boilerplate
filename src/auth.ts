// library imports
import NextAuth, { AuthError, CredentialsSignin } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// types imports
import type { NextAuthConfig, Session, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";
import axios, { AxiosError } from "axios";

interface IUserLogin {
  id: string,
  name: string,
  email: string,
  token: string, expired_at: string,
}

declare module "next-auth" {
  interface User extends IUserLogin {
  }
}

declare module "next-auth/adapters" {
  interface AdapterUser extends IUserLogin { }
}

declare module "next-auth/jwt" {
  interface JWT extends IUserLogin { }
}

const axiosInstance = axios.create({
  baseURL: process.env.API_BASEURL,
  headers: {
    Accept: 'application/json'
  }
});

const constructUserLogin = ({ data, token, expired_at }: ILoginResponse): IUserLogin => {
  const user: IUserLogin = {
    id: data.id + '',
    name: data.name,
    email: data.email,
    token,
    expired_at
  }

  return user;
}

const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {},
        password: {}
      },
      async authorize(credentials) {
        try {
          const data = credentials;

          const response = await axiosInstance.post<ILoginResponse>('login', data);

          console.info('Response Login API', response);

          const user = constructUserLogin(response.data);

          return user as User;
        } catch (error) {
          return null;
        }
      },
    })
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT, user: User }) {
      return { ...token, ...user };
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.user = token;
      return session;
    },
  },
  pages: {
    signIn: '/login'
  },
  session: {
    strategy: 'jwt',
  },
  events: {
    async signIn(message) {
      console.info('user signed in', message.user);
    },
    async signOut(message) {

    },
  }
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);