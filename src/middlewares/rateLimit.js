
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 150,
  message: "Quá nhiều request, thử lại sau"
});

export default limiter;
