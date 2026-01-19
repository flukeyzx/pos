import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;

export function createAccessToken(user) {
  return jwt.sign({ id: user.id }, ACCESS_SECRET, { expiresIn: "15m" });
}

export function createRefreshToken(user) {
  return jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: "30d" });
}
