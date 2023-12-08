export const corsOptions = {
  credentials: true,
  allowedHeaders: [
    "Accept",
    "X-Access-Token",
    "X-Application-Name",
    "X-Request-Sent-Time",
  ],
  methods: ["GET", "POST", "OPTIONS"],
  origin: "*",
};
