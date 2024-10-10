import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { deleteCookie } from 'hono/cookie';

import {  success } from '#requests/common';

import { githubAuth } from "@axel669/acheron";
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
 * development, or the dev UI can't talk to the server properly because of the
 * port difference. */
app.use('*', (ctx, next) => {
  // The environment is only available from inside of an active request.
  const validCors = cors({
      origin: ctx.env.UI_ORIGIN,
      credentials: true
  });

  return validCors(ctx, next);
});


/* Middleware that plucks the current user, if any, from the token and stores
 * the value in the context for other requests to refer to. */
app.use(async (ctx, next) => {
  // Ask for the user from Acheron; if there is one, the result will contain a
  // user field. When there is no user, we ignore that here; the login route
  // triggers the full login flow if we want to log in.
  const result = await githubAuth(
      { request: ctx.req.raw, env: ctx.env },
      ["read:user", "user:email"]
  );

  // Store the result as the auth response; it will have a "user" field if there
  // is a user logged in, or a "res" that we should respond with to initiate the
  // auth flow, if we want to start that.
  ctx.set("auth", result);
  return await next();
});


/*******************************************************************************
 * Server API
 *******************************************************************************
 * The items in this section are related to getting information about the back
 * end server component that is running the application.
 ******************************************************************************/

app.get(`${APIV1}/server_info`, ctx => {
  return success(ctx, 'Retreived server information', commitReference);
});


/* Acheron's GitHub login mechanism redirects to this endpoint to capture the
 * appropriate data from GitHub to complete the login.
 *
 * Here we use the Acheron githubAuth handler and directly return its response
 * so that we can complete the flow. */
app.get(`/login/github`, async (ctx) => {
  // Get the auth object from the middleware
  const result = ctx.get("auth");

  // TODO: What if this gets hand invoked by the user when they're already
  //       logged in? Is there a response of some sort in that case?
  //
  // ANSWER: It blows up because of immutable headers. So if there is already
  //         a user, we should redirect, like /login does/should.

  // Not the final solution to the above, but flick the redirect in the result
  // to go to the app origin, as otherwise it goes to the back end instead.
  //
  // The auth routes should probably be bound to the pages site, or we try to
  // proxy the entire back end as pages functions that defer to the bound
  // listener or such.
  result.res.headers.set("location", ctx.env.app_origin);
  return result.res
});


/* Simple top level route; it returns JSON that tells you about the user that
 * is logged in, if any. */
app.get(`${APIV1}/user`, async (ctx) => {
  // This route simplistically just needs to get the user that was stored into
  // the context by the auth middleware, if there is one.
  return success(ctx, 'retreived information on current user', ctx.get('auth').user ?? {});
});


/* This is an example of a route that is "guarded" and will try to log the user
 * in if they're not already.
 *
 * This should actually be implemented as middleware, generally speaking. */
app.get('/login', async (ctx) => {
  // Get the Acheron GitHub auth information that was set by the auth
  // middleware. This contains either a response, which indicates that we need
  // to perform the auth flow, or it has the information on the user, in which
  // case we are already logged in.
  const result = ctx.get("auth")

  // When the result has a response, it means that the auth flow needs to be
  // kicked off. In that case, we should return the response directly so that
  // the browser gets sent to the auth endpoint.
  //
  // If we didn't want to force a login in this case, then we would not return
  // this value, and the user would just not be logged in.
  if (result.res !== undefined) {
    return result.res;
  }

  // We were already logged in, so redirect to the app origin.
  return ctx.redirect(ctx.env.app_origin);
});


/* Handle a request to log out by deleting the cookie.
 *
 * This is currently redirecting back to the app origin, but presumably it could
 * not do that and then this would just blast the cookie and it would be up to
 * the caller to reload the auth. Not sure what is best there. */
app.get('/logout', async (ctx) => {
  deleteCookie(ctx, 'obol');
  return ctx.redirect(ctx.env.app_origin);
});


/******************************************************************************/


export default app;
