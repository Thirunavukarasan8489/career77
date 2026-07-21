import crypto from "crypto";

const SECRET = process.env.NEXTAUTH_SECRET || "fallback-secret-for-candidate-auth-77";

export interface CandidateSession {
  candidateId: string;
  email: string;
  name: string;
  role?: string;
}

/**
 * Creates a signed JWT-like token for candidate sessions
 */
export function signCandidateSession(session: CandidateSession): string {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  const hmac = crypto.createHmac("sha256", SECRET);
  hmac.update(payload);
  const signature = hmac.digest("base64url");
  return `${payload}.${signature}`;
}

/**
 * Verifies and decodes the candidate session token
 */
export function verifyCandidateSession(token: string): CandidateSession | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payload, signature] = parts;
  const hmac = crypto.createHmac("sha256", SECRET);
  hmac.update(payload);
  const expectedSignature = hmac.digest("base64url");

  if (signature !== expectedSignature) {
    return null; // Tampered or invalid
  }

  try {
    const decoded = Buffer.from(payload, "base64url").toString("utf-8");
    return JSON.parse(decoded) as CandidateSession;
  } catch {
    return null;
  }
}
