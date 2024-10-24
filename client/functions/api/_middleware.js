/* Reflect all accesses to the API directly into the bound version of the
 * dosiero-api service. */
export const onRequest = async (ctx) => {
  console.log(`[API] ${ctx.request.url}`);

  // If the current authentication data from Acheron includes a User object,
  // then add it as a header to the bound request we're about to make to the API
  // so that the API will know who is logged in.
  if (ctx.data.auth.user !== undefined) {
    ctx.request.headers.set('X-Acheron-Auth', btoa(JSON.stringify(ctx.data.auth.user)));
  }

  return await ctx.env.dosiero.fetch(ctx.request);
};
