/******************************************************************************/


import { deleteCookie } from 'hono/cookie';


/******************************************************************************/


/* Handle a request to log out by dropping the cookie that holds the user auth
 * information (if any), and then redirecting back to the app route.
 *
 * This does not bother to check if there is actually a logged in user or not;
 * if that matters to you, try to get the user information first. */
export async function reqAuthLogout(ctx) {
  deleteCookie(ctx, 'obol');
  return ctx.redirect(ctx.env.app_origin);
}



/******************************************************************************/
