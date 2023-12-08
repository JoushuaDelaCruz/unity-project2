export const corsOptions = {
  credentials: true,
  exposedHeaders: ["Content-Length", "Content-Encoding"],
  allowedHeaders: [
    "Accept",
    "X-Access-Token",
    "X-Application-Name",
    "X-Request-Sent-Time",
    "Content-Type",
  ],
  methods: ["GET", "POST", "OPTIONS"],
  origin: "*",
};
