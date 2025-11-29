import jwt from "jsonwebtoken";

// ✔ Middleware giải mã token
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;   // gắn user decode vào req
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

// ✔ Middleware kiểm tra admin
export const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admins only" });
  }
  next();
};
