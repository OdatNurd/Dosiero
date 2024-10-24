/******************************************************************************/


import { success, fail } from '#requests/common';

import { dbGetUserDetails } from '#db/user'


/******************************************************************************/


/* Return back the details of the currently authenicated user; the info for
 * that user comes in the JWT that arrives with each request. This might not
 * have a user if the current request represents someone that is not logged in,
 * in which case this can't return anything useful. */
export async function reqCurrentUserDetails(ctx) {
  // Get the user object that was put in place by the Acheron middleware, if
  // any.
  const user = ctx.get('user');

  // If there is not a user, then we can't actually tell you about one.
  if (user === undefined) {
    return success(ctx, `there is currently no user logged in`, {});
  }

  // Return information on the current user.
  const userInfo = await dbGetUserDetails(ctx.env.db, user.id, user.provider);
  return success(ctx, `details for user ${user.id}`, userInfo);
}



/******************************************************************************/
