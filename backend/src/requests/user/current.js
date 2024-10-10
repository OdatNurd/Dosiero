/******************************************************************************/


import { success, fail } from '#requests/common';


/******************************************************************************/


/* Return back the details of the currently authenicated user; the info for
 * that user comes in the JWT that arrives with each request. This might not
 * have a user if the current request represents someone that is not logged in,
 * in which case this can't return anything useful. */
export async function reqCurrentUserDetails(ctx) {
  // Get the auth object that was put in place by the Acheron middleware and
  // pull out the user, if any.
  const user = ctx.get('auth').user;

  // If there is not a user, then we can't actually tell you about one.
  if (user === undefined) {
    return fail(ctx, `there is currently no user logged in`, 401, {});
  }

  // Return information on the current user.
  return success(ctx, `details for user ${user.id}`, user);
}



/******************************************************************************/
