import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const name = searchParams.get('name') || "スマホユーザー";

  if (!email) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const user = {
    name: name,
    email: email,
    points: 50,
    likes: 0,
    bads: 0,
    penaltyPoints: 0,
    crown: "gold",
    hasPassedTraining: false,
    achievements: 0
  };

  // Set Cookie (Expires in 30 days)
  // URL encoding to handle multi-byte characters like Japanese
  const userJson = JSON.stringify(user);
  
  const response = NextResponse.redirect(new URL('/dashboard', request.url));
  
  // Set the cookie via NextResponse
  response.cookies.set('dreamer_user_data', encodeURIComponent(userJson), {
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return response;
}
