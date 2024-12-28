'use server'
import { cookies } from "next/headers";

export const setTokenCookie = async (token: string) => {
  // document.cookie = `token=${token}; path=/; max-age=7200; secure; samesite=strict`;
  
  (await cookies()).set('token', token, {maxAge : 7200})
};
