export const verifyPortfolioPinMiddleware = (req, res, next) => {
  let rawPin =
    req.headers["x-portfolio-pin"] ||
    req.headers["portfolio-pin"] ||
    req.body?.pin;

  // Process and decode query pin parameter if provided
  if (!rawPin && req.query?.pin) {
    try {
      let queryPin = String(req.query.pin);
      
      // Check for Base64 prefix 'b64_' or standard URL encoding
      if (queryPin.startsWith("b64_")) {
        queryPin = Buffer.from(queryPin.slice(4), "base64").toString("utf-8");
      } else {
        queryPin = decodeURIComponent(queryPin);
      }
      rawPin = queryPin;
    } catch (e) {
      rawPin = String(req.query.pin);
    }
  }

  const expectedPin = process.env.PORTFOLIO_EDIT_PIN || "ty]:LO1c";

  if (rawPin === expectedPin) {
    return next();
  }

  return res.status(401).json({
    success: false,
    message: "Unauthorized: Invalid or missing confidential PIN",
  });
};
