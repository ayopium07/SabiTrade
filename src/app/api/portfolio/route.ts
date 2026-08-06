import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // In a real app, you'd get the userId from the session (e.g., NextAuth, Supabase auth, or Clerk)
    // For now, we will just fetch the first portfolio as a demo
    const portfolio = await prisma.portfolio.findFirst({
      include: {
        user: true,
      },
    });

    if (!portfolio) {
      // Fallback if DB is online but empty
      return NextResponse.json({
        id: 'demo-portfolio-id',
        userId: 'demo-user-id',
        cash: 1000000.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        user: {
          id: 'demo-user-id',
          name: 'Demo Trader',
          email: 'investor@sabitrade.com',
          experienceLevel: 'Beginner'
        }
      });
    }

    return NextResponse.json(portfolio);
  } catch (error) {
    console.error('Error fetching portfolio (returning mock fallback for demo):', error);
    return NextResponse.json({
      id: 'demo-portfolio-id',
      userId: 'demo-user-id',
      cash: 1000000.0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: {
        id: 'demo-user-id',
        name: 'Demo Trader',
        email: 'investor@sabitrade.com',
        experienceLevel: 'Beginner'
      }
    });
  }
}
