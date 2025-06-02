import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const token = jwt.sign({ userId }, secret, { expiresIn: "7d" });

  res.cookie("jwt", token, {
    httpOnly: true, // inaccessible from JavaScript (mitigates XSS)
    secure: process.env.NODE_ENV !== "development", // only over HTTPS in production
    sameSite: "strict", // prevents CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  });

  return token;
};
