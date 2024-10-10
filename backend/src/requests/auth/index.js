/******************************************************************************/


import { Hono } from 'hono'

import { wrappedRequest as _ } from '#requests/common';

import { reqAuthGithubCallback } from '#requests/auth/github';
import { reqAuthLogin } from '#requests/auth/login';
import { reqAuthLogout } from '#requests/auth/logout';


/******************************************************************************/


/* Create a small "sub-application" to wrap all of our routes, and then
 * map all routes in. */
export const auth = new Hono();


auth.get(`/login/github`,  ctx => _(ctx, reqAuthGithubCallback));
auth.get('/login',  ctx => _(ctx, reqAuthLogin));
auth.get('/logout',  ctx => _(ctx, reqAuthLogout));


/******************************************************************************/
