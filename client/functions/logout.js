/******************************************************************************/


/* Handle a request to log out by dropping the cookie that holds the user auth
 * information (if any), and then redirecting back to the app route.
 *
 * This does not bother to check if there is actually a logged in user or not;
 * if that matters to you, try to get the user information first. */
export const onRequestGet = async (ctx) => {
  const headers = new Headers({ location: '/', 'Set-Cookie': 'obol=; Expires=Thu, 01 Jan 1970 00:00:00 UTC' });
  return new Response(null, { headers, status: 302 });
}


/******************************************************************************/
