/******************************************************************************/


/* This middleware runs for all functions that are not part of the API (which
 * has its own that reflects access into the Dosiero API worker) and uses
 * Acheron to set up the appropriate auth data in the context for the other
 * functions to handle. */
export const onRequestGet = async (ctx) => {
  // Pull the auth object from the middleware that got us here.
  const result = ctx.data.auth;

  // If the result has a response, it means that there is no user, in which case
  // the response should be returned so that the auth flow is kicked off.
  if (result.res !== undefined) {
    return result.res;
  }

  // The user must already be logged in; nothing to do in that case.
  const headers = new Headers({ location: '/' });
  return new Response(null, { headers, status: 302 });
}


/******************************************************************************/
