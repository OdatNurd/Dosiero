/******************************************************************************/


/* Handle a request to log out by dropping the cookie that holds the user auth
 * information (if any), and then redirecting back to the app route.
 *
 * This does not bother to check if there is actually a logged in user or not;
 * if that matters to you, try to get the user information first. */
export const onRequestGet = async (ctx) => {
  // Proxy to the Acheron route to get the response that will log the user out,
  // and then grab the cookie headers from it
  const logout = await ctx.env.acheron.fetch(ctx.request);
  const cookies = logout.headers.getSetCookie();

  // Create new headers that redirect to the root of the site and also set all
  // cookies as provided by the Acheron route
  const headers = new Headers({ location: '/'});
  cookies.forEach(cookie => headers.append('Set-Cookie', cookie));

  // Redirect
  return new Response(null, { headers, status: 302 });
}


/******************************************************************************/
