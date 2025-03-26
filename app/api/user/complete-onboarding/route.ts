import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    // Log start of request processing
    console.log('Starting complete-onboarding route processing')

    // Development environment authentication bypass
    const headers = Object.fromEntries(request.headers.entries())
    console.log('Incoming headers:', JSON.stringify(headers, null, 2))

    let session;
    const isDevelopment = process.env.NODE_ENV === 'development'

    try {
      // Check for development mode header or use environment check
      if (
        (isDevelopment && headers['x-development-mode'] === 'true') || 
        (isDevelopment && headers['x-test-user-id'])
      ) {
        // Create a mock session for testing
        session = {
          user: {
            id: headers['x-test-user-id'],
            email: headers['x-test-user-email'] || null
          }
        }
        console.log('Using test session:', JSON.stringify(session, null, 2))
      } else {
        // Normal authentication flow
        session = await getServerSession(authOptions)
      }
    } catch (authError) {
      console.error('Authentication Error:', authError)
      return NextResponse.json(
        { 
          success: false, 
          error: "Authentication failed", 
          details: authError instanceof Error 
            ? { 
                message: authError.message, 
                name: authError.name,
                stack: isDevelopment ? authError.stack : undefined 
              }
            : "Unknown authentication error"
        }, 
        { status: 401 }
      )
    }

    if (!session?.user?.id) {
      console.warn('No valid session found')
      return NextResponse.json(
        { success: false, error: "Unauthorized" }, 
        { status: 401 }
      )
    }

    // Parse the request body
    let body;
    try {
      body = await request.json();
      console.log('Parsed request body:', JSON.stringify(body, null, 2))

      // Validate request body
      if (!body || typeof body !== 'object') {
        throw new Error('Invalid request body: must be a non-null object')
      }
    } catch (parseError) {
      console.error('Body parsing error:', parseError)
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid request body", 
          details: parseError instanceof Error 
            ? parseError.message 
            : "Unknown parsing error"
        }, 
        { status: 400 }
      )
    }

    // Validate user exists
    let existingUser;
    try {
      existingUser = await prisma.user.findUnique({
        where: { id: session.user.id }
      })
    } catch (findError) {
      console.error('User lookup error:', findError)
      return NextResponse.json(
        { 
          success: false, 
          error: "Database lookup failed", 
          details: findError instanceof Error 
            ? { 
                message: findError.message, 
                name: findError.name,
                stack: isDevelopment ? findError.stack : undefined 
              }
            : "Unknown database error"
        }, 
        { status: 500 }
      )
    }

    if (!existingUser) {
      console.warn(`User not found with ID: ${session.user.id}`)
      return NextResponse.json(
        { success: false, error: "User not found" }, 
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData: Record<string, any> = {
      onboardingStatus: 11  // Now storing as number
    }

    // Conditionally add name and email
    if (body.name) {
      updateData.name = body.name
    }
    if (body.email) {
      updateData.email = body.email
    }

    // Perform user update
    let updatedUser;
    try {
      updatedUser = await prisma.user.update({
        where: { 
          id: session.user.id 
        },
        data: updateData,
        select: {
          id: true,
          onboardingStatus: true,
          name: true,
          email: true
        }
      })
    } catch (updateError) {
      console.error('User update error:', updateError)
      return NextResponse.json(
        { 
          success: false, 
          error: "User update failed", 
          details: updateError instanceof Error 
            ? { 
                message: updateError.message, 
                name: updateError.name,
                stack: isDevelopment ? updateError.stack : undefined 
              }
            : "Unknown update error"
        }, 
        { status: 500 }
      )
    }

    console.log('User onboarding completed:', JSON.stringify(updatedUser, null, 2))

    return NextResponse.json({
      success: true,
      userId: updatedUser.id,
      onboardingStatus: updatedUser.onboardingStatus,
      name: updatedUser.name,
      email: updatedUser.email
    })
  } catch (error) {
    // Catch-all error handling
    console.error("Unexpected complete onboarding error:", error)

    // Detailed error logging
    const errorDetails = error instanceof Error 
      ? {
          message: error.message,
          name: error.name,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }
      : "Unknown unexpected error";

    return NextResponse.json(
      {
        success: false,
        error: "Critical internal server error",
        details: errorDetails
      },
      { status: 500 }
    )
  }
}