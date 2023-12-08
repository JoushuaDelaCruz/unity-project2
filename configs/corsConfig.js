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
  origin: "https://shimmering-lily-0f8e29.netlify.app",
  secure: true,
};
