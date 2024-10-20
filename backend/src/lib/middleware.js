/******************************************************************************/


import { githubAuth } from '@axel669/acheron';

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

  // If there was a user in the auth result, clean up it's ID to ensure that
  // it's a string and look up the internal userId that represents this user,
  // if we can.
  const user = result.user;
  if (user !== undefined) {
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
