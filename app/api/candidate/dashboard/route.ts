import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { CandidateService } from '@/server/services/candidate.service';

const candidateService = new CandidateService();

export async function GET(_req: Request) {
  try {
    let candidateIdStr = '';
    let isNextAuthUserId = false;
    const session = await getServerSession(authOptions);

    if (session && session.user && (session.user as any).role === 'candidate') {
      candidateIdStr = (session.user as any).id;
      isNextAuthUserId = true;
    } else {
      const { getCandidateSession } = await import('@/lib/auth');
      const candidateSession = await getCandidateSession();
      if (candidateSession && candidateSession.role === 'candidate') {
        candidateIdStr = candidateSession.candidateId;
        isNextAuthUserId = false;
      }
    }

    if (!candidateIdStr) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const dashboardData = await candidateService.getDashboard(candidateIdStr, isNextAuthUserId);

    return NextResponse.json(dashboardData);
  } catch (error: any) {
    if (error.message === "Candidate not found") {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }
    console.error('Dashboard fetch error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
