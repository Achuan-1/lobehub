// Netlify's public single-user deployment short-circuits authentication before
// this method is called. Keeping the stub edge-safe prevents the middleware
// bundle from pulling PostgreSQL and other Node-only authentication modules.
export const auth = {
  api: {
    getSession: async () => null,
  },
};
