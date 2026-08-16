import { cache } from "react";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { verifyPassword } from "@/lib/password";

export { hashPassword, verifyPassword } from "@/lib/password";

export const SESSION_COOKIE = "kolmainu_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("AUTH_SECRET puudub — sisselogimine on välja lülitatud.");
    }
    return new TextEncoder().encode("kolmainu-dev-secret-not-for-production");
  }
  return new TextEncoder().encode(value);
}

export type Session = {
  userId: string;
  tenantId: string | null;
  email: string;
  name: string | null;
  role: string;
};

export async function createSession(session: Session) {
  const token = await new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.userId)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secret());

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export const getSession = cache(async (): Promise<Session | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return {
      userId: String(payload.sub),
      tenantId: (payload.tenantId as string | null) ?? null,
      email: String(payload.email ?? ""),
      name: (payload.name as string | null) ?? null,
      role: String(payload.role ?? "admin"),
    };
  } catch {
    return null;
  }
});

export async function authenticate(email: string, password: string) {
  if (!db) return { error: "Andmebaas pole seadistatud." as const };
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.trim().toLowerCase()))
    .limit(1);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { error: "Vale e-post või parool." as const };
  }
  await createSession({
    userId: user.id,
    tenantId: user.tenantId,
    email: user.email,
    name: user.name,
    role: user.role,
  });
  return { ok: true as const };
}
