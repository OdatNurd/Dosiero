/******************************************************************************/


import { Hono } from 'hono'

import { wrappedRequest as _ } from '#requests/common';

import { reqCurrentUserDetails } from '#requests/user/current';


/******************************************************************************/


/* Create a small "sub-application" to wrap all of our routes, and then
 * map all routes in. */
export const user = new Hono();


user.get('/current', ctx => _(ctx, reqCurrentUserDetails));


/******************************************************************************/
