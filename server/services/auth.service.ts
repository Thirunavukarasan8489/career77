import { AuthRepository } from "@/server/repositories/auth.repository";
import bcrypt from "bcryptjs";
import { Candidate } from "@/models/Candidate";
import { Recruiter } from "@/models/Recruiter";

const authRepository = new AuthRepository();

export class AuthService {
  async registerCandidate(data: any) {
    const { name, email, password } = data;

    if (!name || !email || !password) {
      throw new Error("Missing required fields");
    }

    const emailLower = email.toLowerCase().trim();
    const existingUser = await authRepository.getUserByEmail(emailLower);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await authRepository.createUser({
      email: emailLower,
      password: hashedPassword,
      role: 'candidate',
    });

    await Candidate.create({
      userId: newUser._id,
      name,
      email: emailLower,
      skills: [],
      resumes: [],
      savedJobs: []
    });

    return newUser._id;
  }

  async registerRecruiter(data: any) {
    const { email, password, companyName } = data;

    if (!email || !password || !companyName) {
      throw new Error("Email, password, and company name are required fields");
    }

    const emailLower = email.toLowerCase().trim();
    const existingRecruiter = await Recruiter.findOne({ email: emailLower });
    if (existingRecruiter) {
      throw new Error("A recruiter with this email is already registered");
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    const user = await authRepository.createUser({
      email: emailLower,
      password: hashedPassword,
      role: "recruiter",
    });

    const recruiter = await Recruiter.create({
      userId: user._id,
      email: emailLower,
      password: hashedPassword,
      companyName: companyName.trim(),
    });

    return {
      id: recruiter._id.toString(),
      email: recruiter.email,
      companyName: recruiter.companyName,
    };
  }
}
