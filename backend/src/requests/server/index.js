/******************************************************************************/


import { Hono } from 'hono'

import { wrappedRequest as _ } from '#requests/common';

import { reqServerVersion } from '#requests/server/version';


/******************************************************************************/


/* Create a small "sub-application" to wrap all of our routes, and then
 * map all routes in. */
export const server = new Hono();


server.get('/version', ctx => _(ctx, reqServerVersion));


/******************************************************************************/
