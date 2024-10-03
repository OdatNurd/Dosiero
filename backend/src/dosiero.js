import { Hono } from 'hono';
import { cors } from 'hono/cors'

import { commitReference } from '#commit';


/******************************************************************************/


/* The Hono application that we use for routing; by exporting this directly, it
 * will hook into the appropriate Cloudflare Worker infrastructure to allow us
 * to handle requests. */
const app = new Hono();

/* The current API version; this prefixes all of our routes. */
const APIV1 = '/api/v1'

/* Ensure that the application can talk to the API. The value for the variable
 * is generally '*' in production, but needs to be the local URL of the UI in
 * development, or the dev UI can't talk to the API. */
app.use('/api/*', (ctx, next) => {
    // The environment is only available from inside of an active request.
    const validCors = cors({
        origin: ctx.env.UI_ORIGIN,
        credentials: true
    });

    return validCors(ctx, next);
});


/*******************************************************************************
 * Server API
 *******************************************************************************
 * The items in this section are related to getting information about the back
 * end server component that is running the application.
 ******************************************************************************/

app.get(`${APIV1}/server_info`, ctx => {
    return ctx.json(commitReference);
});


/******************************************************************************/


export default app;
