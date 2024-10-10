/******************************************************************************/


/* Handles a GitHub authentication callback call via Acheron; this endpoint gets
 * hit while authenticating with GitHub, when GitHub wants to call back with the
 * authentication result. */
export async function reqAuthGithubCallback(ctx) {
  // Pull the auth object from the middleware that got us here.
  const result = ctx.get("auth");

  // TODO: What if this gets hand invoked by the user when they're already
  //       logged in? Is there a response of some sort in that case?
  //
  // ANSWER: It blows up because of immutable headers. So if there is already
  //         a user, we should redirect, like /login does/should.

  // Not the final solution to the above, but flick the redirect in the result
  // to go to the app origin, as otherwise it goes to the back end instead.
  //
  // The auth routes should probably be bound to the pages site, or we try to
  // proxy the entire back end as pages functions that defer to the bound
  // listener or such.
  result.res.headers.set("location", ctx.env.app_origin);
  return result.res
}



/******************************************************************************/
