/******************************************************************************/


/* Handles a GitHub authentication callback call via Acheron; this endpoint gets
 * hit while authenticating with GitHub, when GitHub wants to call back with the
 * authentication result. */
export const onRequestGet = async (ctx) => {
  // Pull the auth object from the middleware that got us here.
  const result = ctx.data.auth;

  // If the result has a response, it means that there is no user, in which case
  // the response should be returned so that the auth flow is kicked off.
  if (result.res !== undefined) {
    return result.res;
  }

  // TODO: What if this gets hand invoked by the user?
  //
  // ANSWER: It throws an error from github (displayed as JSON) because of an
  //         invalid token.
  return result.res
}


/******************************************************************************/

