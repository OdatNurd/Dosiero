/******************************************************************************/


/* Trigger an authenication request flow based on the data that was gathered
 * by the Acheron middleware.
 *
 * This will check to see if there is already a logged in user, and if so the
 * result will be to send the user back to the app root. If there is not a
 * user already logged in, start the authentication flow instead. */
export async function reqAuthLogin(ctx) {
  // Pull the auth object from the middleware that got us here.
  const result = ctx.get("auth")

  // If the result has a response, it means that there is no user, in which case
  // the response should be returned so that the auth flow is kicked off.
  if (result.res !== undefined) {
    return result.res;
  }

  // The user must already exist, so just redirect to where the auth flow would
  // have otherwise ended up to make this an effective no-op.
  return ctx.redirect(ctx.env.app_origin);
}



/******************************************************************************/
