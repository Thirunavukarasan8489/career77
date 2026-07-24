import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/db';
import { Candidate } from '@/models/Candidate';
import cloudinary from '@/lib/cloudinary';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== 'candidate') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const candidate = await Candidate.findOne({ userId: (session.user as any).id });
    if (!candidate) return NextResponse.json({ message: 'Candidate not found' }, { status: 404 });

    const resumeIndex = candidate.resumes.findIndex((r: any) => r._id.toString() === id);
    if (resumeIndex === -1) {
      return NextResponse.json({ message: 'Resume not found' }, { status: 404 });
    }

    const resume = candidate.resumes[resumeIndex];

    // Delete from cloudinary
    if (resume.publicId) {
      await cloudinary.uploader.destroy(resume.publicId);
    }

    // Remove from array
    candidate.resumes.splice(resumeIndex, 1);

    // If we deleted the primary, make the first remaining one primary
    if (resume.isPrimary && candidate.resumes.length > 0) {
      candidate.resumes[0].isPrimary = true;
    }

    await candidate.save();
    return NextResponse.json(candidate.resumes);
  } catch (error: any) {
    console.error('Delete resume error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== 'candidate') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const candidate = await Candidate.findOne({ userId: (session.user as any).id });
    if (!candidate) return NextResponse.json({ message: 'Candidate not found' }, { status: 404 });

    // Find if exists
    const resumeExists = candidate.resumes.some((r: any) => r._id.toString() === id);
    if (!resumeExists) {
      return NextResponse.json({ message: 'Resume not found' }, { status: 404 });
    }

    candidate.resumes.forEach((r: any) => {
      r.isPrimary = r._id.toString() === id;
    });

    await candidate.save();
    return NextResponse.json(candidate.resumes);
  } catch (error: any) {
    console.error('Update resume error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
