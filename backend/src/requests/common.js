/******************************************************************************/


import { validator } from 'hono/validator';


/******************************************************************************/


/* Generate a standardized success response from an API call.
 *
 * This generates a JSON return value with the given HTTP status, with a
 * data section that contains the provided result, whatever it may be
 * as well as an optional message. */
export const success = (ctx, message, result, status) => {
  status ??= 200;
  result ??= [];

  ctx.status(status);
  return ctx.json({ success: true, message, data: result });
}


/******************************************************************************/


/* Generate a standardized error response from an API call.
 *
 * This generates a JSON return value with the given HTTP status, with an
 * error reason that is the message specified. */
export const fail = (ctx, message, status, result) => {
  status ??= 400;

  ctx.status(status);
  return ctx.json({ success: false, message, data: result });
}


/******************************************************************************/


/* Create a validator that will validate the type of request data provided
 * against a specifically defined schema object. The data is both validated
 * against the schema as well as filtered so that non-schema properties of the
 * data are discarded.
 *
 * This provides a middleware filter for use in Hono; it is expected to either
 * trigger a failure, or return the data that is the validated and cleaned
 * object from the request.
 *
 * When using this filter, underlying requests can fetch the validated data
 * via the ctx.req.valid() function, e.g. ctx.req.valid('json'). */
export const validate = (dataType, schemaObj) => validator(dataType, async (value, ctx) => {
  // Using this schema, parse the data out; this does the work of conforming
  // the value to the appropriate schema.
  const result = await schemaObj.safeParseAsync(value);

  // If there was no issue, return the result back directly; this will be the
  // parsed and sanitized object.
  if (result.success === true) {
    return result.data;
  }

  // There was a problem; flatten the error structure down and grab out the
  // first field error to use as our failure message before we return.
  //
  // TODO: This could be made much better, but we're currently in a state of
  //       flux as to what the errors should look like and what library we use
  //       for the sanitization.
  // console.log(JSON.stringify(result.error, null, 2));
  const errors = result.error.flatten();

  // If there are any field errors, then handle those by saying what is wrong.
  const keys = Object.keys(errors.fieldErrors);
  if (keys.length !== 0) {
    const field = keys[0];
    return fail(ctx, `error in ${field}: ${errors.fieldErrors[field][0]}`);
  }

  // If there is not a field error, then there has to be a form error instead,
  // which gives us more structural information on the error.
  return fail(ctx, errors.formErrors[0]);
});


/******************************************************************************/


/* Given a context and a handler function, invoke the handler, giving it the
 * context.
 *
 * This catches any exceptions thrown by the handler and will cause an
 * appropriate error response to be generated, so that the request code only has
 * to worry about the success path. */
export async function wrappedRequest(ctx, handler) {
  try {
    return await handler(ctx);
  }
  catch (err) {
    // Fall back to a 500 error for everything else.
    return fail(ctx, err.message, 500);
  }
}


/******************************************************************************/
