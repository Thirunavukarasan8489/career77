import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { StorageService } from '@/server/services/storage.service';
import { connectToDatabase } from '@/lib/db';
import { Candidate } from '@/models/Candidate';

const storageService = new StorageService();

export async function POST(req: Request) {
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

    await connectToDatabase();
    const candidate = await Candidate.findById(candidateIdStr);
    if (!candidate) return NextResponse.json({ message: 'Candidate not found' }, { status: 404 });
    
    if (candidate.resumes.length >= 3) {
       return NextResponse.json({ message: 'Maximum of 3 resumes allowed' }, { status: 400 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    const uploadedFile = await storageService.uploadFile(file, 'resumes');

    const newResume = {
      ...uploadedFile,
      isPrimary: candidate.resumes.length === 0,
      uploadedAt: new Date()
    };

    candidate.resumes.push(newResume);
    await candidate.save();

    return NextResponse.json(candidate.resumes);
  } catch (error: any) {
    if (error.message === 'No file uploaded') {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    console.error('Upload resume error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
