/******************************************************************************/


import { githubAuth } from "@axel669/acheron";


/******************************************************************************/


/* This middleware runs for all functions that are not part of the API (which
 * has its own that reflects access into the Dosiero API worker) and uses
 * Acheron to set up the appropriate auth data in the context for the other
 * functions to handle. */
export const onRequest = async (ctx) => {
  // Ask for the user from Acheron; if there is one, the result will contain a
  // user field. When there is no user, the res property contains the redirect
  // needed to trigger the auth flow. We ignore that here; the login route
  // triggers the full login flow if we want to log in.
  const result = await githubAuth(ctx, ["read:user", "user:email"]);

  // Store the result for the other functions to deal with, then proceed with
  // the request.
  ctx.data.auth = result;;
  return await ctx.next();
}


/******************************************************************************/
