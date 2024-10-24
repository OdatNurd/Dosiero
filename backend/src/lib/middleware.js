/******************************************************************************/


import { dbUserAddNew, dbUserGetUserId } from '#db/user'


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

  // Check to see if we have an authentication header from the client that has
  // bound to us; if we do, it should contain Base64 encoded JSON version of the
  // Acheron authentication object.
  const auth = ctx.req.headers.get('X-Acheron-Auth');
  const user = (auth === null) ? null : JSON.parse(atob(auth));
  if (user !== null) {
    ctx.set("user", user);
  }

  // If there was a user in the auth result, clean up it's ID to ensure that
  // it's a string and look up the internal userId that represents this user,
  // if we can.
  if (user !== null) {
    user.id = String(user.id);

    // TODO: This should be cached so that we don't need to hit the DB
    //       literally every time.
    user.userId = await dbUserGetUserId(ctx.env.db, user.id, user.provider);

    // If we didn't get a userId, this is the first time this user has logged in
    // so we need to add them to the database.
    if (user.userId === null) {
      user.userId = await dbUserAddNew(ctx.env.db, user);

      // TODO: the new userId should be added to the cache here
    }
  }

  return await next();
}


/******************************************************************************/
