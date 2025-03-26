import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      emailVerified: Date;
      name?: string;
      image?: string;
      onboardingStatus: number;
    }
  }

  interface User {
    id: string;
    email: string;
    emailVerified: Date | null;
    onboardingStatus: number;
  }
}
