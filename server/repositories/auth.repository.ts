import { User } from "@/models/User";
import { connectToDatabase } from "@/lib/db";

export class AuthRepository {
  async getUserByEmail(email: string) {
    await connectToDatabase();
    return await User.findOne({ email });
  }

  async createUser(data: any) {
    await connectToDatabase();
    return await User.create(data);
  }
}
