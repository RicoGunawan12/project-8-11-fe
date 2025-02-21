'use server'
import { cookies } from "next/headers";

export const setTokenCookie = async (token: string) => {
  (await cookies()).set('token', token, {maxAge : 7200})
};

export const setCurrentUserId = async (id: string) => {
  (await cookies()).set('userId', id, {maxAge : 7200})
};