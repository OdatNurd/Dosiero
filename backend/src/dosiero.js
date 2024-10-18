import { Hono } from 'hono';

import { acheronAuth } from '#lib/middleware';

import { server } from '#requests/server/index';
import { user } from '#requests/user/index';


/******************************************************************************/


/* The Hono application that we use for routing; by exporting this directly, it
 * will hook into the appropriate Cloudflare Worker infrastructure to allow us
 * to handle requests. */
const app = new Hono();

/* The current API version; this prefixes all of our routes. */
const APIV1 = '/api/v1'

/* Set up the middleware for Acheron auth to handle authentication of the
 * current user. */
app.use('*', acheronAuth);


/*******************************************************************************
 * Server API
 *******************************************************************************
 * The routes in this section are related to getting information about the back
 * end server component that is running the application.
 ******************************************************************************/

app.route(`${APIV1}/server`, server);


/*******************************************************************************
 * User API
 *******************************************************************************
 * The routes in this section are related to searching the list of users for
 * specific users, getting lists, and making modifications to existing users.
 *
 * There is no endpoint here for inserting a user; that happens implictly as a
 * part of auth requests.
 ******************************************************************************/

app.route(`${APIV1}/user`, user);


/******************************************************************************/


export default app;
