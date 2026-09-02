// Netlify's legacy middleware entry is compiled for the Edge runtime. The
// Node.js OpenTelemetry registration is guarded at runtime, but webpack still
// follows its dynamic import while building middleware. Keep that Node-only
// dependency out of the Edge bundle.
export {};
