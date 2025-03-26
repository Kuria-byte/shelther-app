import { PrismaAdapter } from "@auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import EmailProvider from "next-auth/providers/email"
import { prisma } from "./prisma"
import type { 
  Adapter, 
  AdapterUser, 
  AdapterAccount, 
  AdapterSession,
  VerificationToken 
} from "next-auth/adapters"
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Fix interface declarations
interface CustomUser extends AdapterUser {
  onboardingStatus: number;
}

interface CreateUserData {
  email: string;
  emailVerified?: Date | null;
  name?: string | null;
  image?: string | null;
  onboardingStatus?: number;
} 

interface UpdateUserData {
  id: string;
  email?: string | null;
  emailVerified?: Date | null;
  name?: string | null;
  image?: string | null;
  onboardingStatus?: number;
}

// Create custom adapter with proper types
const customAdapter: Adapter = {
  createUser: async (data: Omit<AdapterUser, "id">) => {
    const user = await prisma.user.create({
      data: {
        email: data.email,
        emailVerified: null,
        onboardingStatus: 0,
      },
    })
    return {
      ...user,
      onboardingStatus: Number(user.onboardingStatus)
    } as AdapterUser
  },

  getUser: async (id) => {
    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) return null
    return {
      ...user,
      email: user.email || "",
      onboardingStatus: user.onboardingStatus || 0,
    } as CustomUser
  },

  getUserByEmail: async (email) => {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return null
    return {
      ...user,
      email: user.email || "",
      onboardingStatus: user.onboardingStatus || 0,
    } as CustomUser
  },

  updateUser: async (data: UpdateUserData) => {
    const { id, ...updateData } = data
    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    })
    return {
      ...user,
      email: user.email || "",
      onboardingStatus: user.onboardingStatus || 0,
    } as CustomUser
  },

  // Add other required adapter methods
  deleteUser: async (userId) => {
    const user = await prisma.user.delete({ where: { id: userId } })
    return { 
      ...user, 
      email: user.email || "",
      onboardingStatus: user.onboardingStatus 
    } as AdapterUser
  },

  linkAccount: async (data: AdapterAccount) => {
    await prisma.account.create({ data })
  },

  unlinkAccount: async (data) => {
    await prisma.account.delete({
      where: {
        provider_providerAccountId: {
          provider: data.provider,
          providerAccountId: data.providerAccountId,
        }
      }
    })
  },

  getSessionAndUser: async (sessionToken) => {
    const userAndSession = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    })
    if (!userAndSession) return null

    const { user, ...session } = userAndSession
    return {
      user: {
        ...user,
        email: user.email || "",
        onboardingStatus: user.onboardingStatus || 0,
      } as CustomUser,
      session,
    }
  },

  createSession: async (data: AdapterSession) => {
    return prisma.session.create({ data })
  },

  updateSession: async (data: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">) => {
    return prisma.session.update({
      where: { sessionToken: data.sessionToken },
      data,
    })
  },

  deleteSession: async (sessionToken) => {
    await prisma.session.delete({ where: { sessionToken } })
  },

  createVerificationToken: async (data: VerificationToken) => {
    const verificationToken = await prisma.verificationToken.create({
      data: {
        identifier: data.identifier,
        token: data.token,
        expires: data.expires,
      },
    })
    return verificationToken
  },

  useVerificationToken: async ({ identifier, token }) => {
    try {
      const verificationToken = await prisma.verificationToken.delete({
        where: {
          identifier_token: {
            identifier,
            token,
          },
        },
      })
      return verificationToken
    } catch {
      // If token not found or already used, return null
      return null
    }
  },
}

// Add sendVerificationRequest function
const sendVerificationRequest = async (params: {
  identifier: string
  url: string
  provider: any
}) => {
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: params.identifier,
      subject: "Sign in to Shelther",
      html: `
        <div style="padding: 20px; background-color: #f5f5f5;">
          <h2>Welcome to Shelther</h2>
          <p>Click the link below to sign in:</p>
          <a href="${params.url}" style="
            display: inline-block;
            padding: 10px 20px;
            background-color: #8A4FFF;
            color: white;
            text-decoration: none;
            border-radius: 5px;
          ">
            Sign in to Shelther
          </a>
          <p style="margin-top: 20px; font-size: 12px; color: #666;">
            If you didn't request this email, you can safely ignore it.
          </p>
        </div>
      `,
    })
  } catch (error) {
    console.error('Error sending verification email:', error)
    throw new Error('Failed to send verification email')
  }
}

export const authOptions: NextAuthOptions = {
  adapter: customAdapter,
  session: { strategy: "jwt" },
  pages: {
    signIn: '/auth/signup',
    verifyRequest: '/auth/verify',
    error: '/auth/error',
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Handle email verification callback
      if (url.includes('/api/auth/callback/email')) {
        // Redirect to onboarding with initial step
        return `${baseUrl}/onboarding?step=10`
      }
      // Default redirect handling
      return url.startsWith(baseUrl) ? url : baseUrl
    },
    async jwt({ token, user }) {
      if (user) {
        const customUser = user as CustomUser
        token.sub = customUser.id
        token.email = customUser.email
        token.emailVerified = customUser.emailVerified
        token.onboardingStatus = customUser.onboardingStatus || 0
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
        session.user.email = token.email as string
        session.user.emailVerified = token.emailVerified as Date
        session.user.onboardingStatus = (token.onboardingStatus as number) || 0
      }
      return session
    }
  },
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.RESEND_FROM_EMAIL!,
      sendVerificationRequest, // Now this is defined
    })
  ],
}