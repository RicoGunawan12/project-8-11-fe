
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

export const checkTokenCookieValid = async () => {
  if (typeof document === undefined) return false;

  const clientToken = getTokenCookie();

  const response = await fetch(`${process.env.USER}/logged-in`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${clientToken}`,
    },
  });

  return response.status === 200;
}


export const deleteTokenCookie = () => {
    document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}