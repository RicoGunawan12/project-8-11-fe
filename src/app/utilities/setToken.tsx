'use server'
import { cookies } from "next/headers";

export const setTokenCookie = async (token: string) => {
  (await cookies()).set('token', token, {maxAge : 7200})
};
