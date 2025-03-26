import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { name } = await request.json()

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { name },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Profile update error:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
