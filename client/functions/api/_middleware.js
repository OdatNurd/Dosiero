/* Reflect all accesses to the API directly into the bound version of the
 * dosiero-api service. */
export const onRequest = async (ctx) => await ctx.env.dosiero.fetch(ctx.request);
