import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { CandidateService } from '@/server/services/candidate.service';

const candidateService = new CandidateService();

export async function GET(_req: Request) {
  try {
    let candidateIdStr = '';
    const session = await getServerSession(authOptions);

    if (session && session.user && (session.user as any).role === 'candidate') {
      candidateIdStr = (session.user as any).id;
    } else {
      const { getCandidateSession } = await import('@/lib/auth');
      const candidateSession = await getCandidateSession();
      if (candidateSession && candidateSession.role === 'candidate') {
        candidateIdStr = candidateSession.candidateId;
      }
    }

    if (!candidateIdStr) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const candidate = await candidateService.getProfile(candidateIdStr);
    return NextResponse.json({ candidate });
  } catch (error: any) {
    if (error.message === "Candidate profile not found") {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }
    console.error('Fetch profile error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    let candidateIdStr = '';
    const session = await getServerSession(authOptions);

    if (session && session.user && (session.user as any).role === 'candidate') {
      candidateIdStr = (session.user as any).id;
    } else {
      const { getCandidateSession } = await import('@/lib/auth');
      const candidateSession = await getCandidateSession();
      if (candidateSession && candidateSession.role === 'candidate') {
        candidateIdStr = candidateSession.candidateId;
      }
    }

    if (!candidateIdStr) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const updates = await req.json();
    const candidate = await candidateService.updateProfile(candidateIdStr, updates);

    return NextResponse.json({ candidate });
  } catch (error: any) {
    if (error.message === "Candidate profile not found") {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }
    console.error('Update profile error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
