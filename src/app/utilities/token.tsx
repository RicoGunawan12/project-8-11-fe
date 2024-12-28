import { cookies } from "next/headers";

export const setTokenCookie = async (token: string) => {
  // document.cookie = `token=${token}; path=/; max-age=7200; secure; samesite=strict`;
  
  (await cookies()).set('token', token, {maxAge : 7200})
};

export const getTokenCookie = () => {

  if (typeof document !== "undefined") {
    const name = "token=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(";");

    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i].trim();
      if (cookie.startsWith(name)) {
        return cookie.substring(name.length, cookie.length);
      }
    }
  }

  return null;
};


export const deleteTokenCookie = () => {
    document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}