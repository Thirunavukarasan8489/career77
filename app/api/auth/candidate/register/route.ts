import { NextResponse } from 'next/server';
import { AuthService } from '@/server/services/auth.service';

const authService = new AuthService();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userId = await authService.registerCandidate(body);
    
    return NextResponse.json({ message: 'Candidate registered successfully', userId }, { status: 201 });
  } catch (error: any) {
    if (error.message.includes('required') || error.message.includes('exists')) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    console.error('Candidate registration error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

