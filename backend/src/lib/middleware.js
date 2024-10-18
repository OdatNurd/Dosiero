/******************************************************************************/


import { githubAuth } from "@axel669/acheron";


/******************************************************************************/


/* Acheron based middleware that handles checking for the cookie that tells us
 * who the logged in user is and attaching information on the authenticated
 * user to the request context.
 *
 * If there is no such cookie, instead of a user a response that can be used to
 * trigger the auth flow is inserted instead, allowing downstream routes to
 * trigger the auth flow. */
export async function acheronAuth(ctx, next) {
  console.log(`[${ctx.req.method}] ${ctx.req.url}`);

  // Ask for the user from Acheron; if there is one, the result will contain a
  // user field. When there is no user, we ignore that here; the login route
  // triggers the full login flow if we want to log in.
  const result = await githubAuth(
      { request: ctx.req.raw, env: ctx.env },
      ["read:user", "user:email"]
  );

  // Store the result as the auth response; it will have a "user" field if there
  // is a user logged in, or a "res" that we should respond with to initiate the
  // auth flow, if we want to start that. How that is handled is up to the
  // downstream code.
  ctx.set("auth", result);
  return await next();
}


/******************************************************************************/
