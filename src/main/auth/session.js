import keytar from "keytar";
import z from "zod";

const userSchema = z.object({
  id: z.uuidv4("user Id is required for user session."),
  username: z.string("username is required for user session."),
});

// global user session state in main process
let session = null;

export async function setSession(user) {
  const parsed = userSchema.parse(user);
  session = parsed;
  try {
    await keytar.setPassword(process.env.SERVICE_NAME, "lastUserId", user.id);
  } catch (error) {
    console.error("Error in setSession function.", error);
  }
}

export function getSession() {
  return session;
}

export async function clearSession() {
  session = null;
  try {
    await keytar.deletePassword(process.env.SERVICE_NAME, "lastUserId");
  } catch (error) {
    console.error("Error in clearSession function.", error);
  }
}

export async function getLastUserId() {
  try {
    return await keytar.getPassword(process.env.SERVICE_NAME, "lastUserId");
  } catch (error) {
    console.error("Error in getLastUserId function.", error);
  }
}
