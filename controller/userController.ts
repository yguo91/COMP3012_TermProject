import * as db from "../db";
import { User } from "@prisma/client";

export const getUserByEmailIdAndPassword = async (
  uname: string,
  password: string
): Promise<User | null> => {
  let user = await db.getUserByUsername(uname);
  if (user) {
    if (user.password === password) {
      return user;
    } else {
      return null;
    }
  }
  return null;
};

export const getUserById = async (id: number): Promise<User | null> => {
  let user = await db.getUser(Number(id));
  if (user) {
    return user;
  }
  return null;
};

// Find or create user for OAuth (Google)
export const findOrCreateUser = async (userData: {
  googleId: string;
  email: string;
  name: string;
}): Promise<User> => {
  // First, try to find user by googleId
  let user = await db.getUserByGoogleId(userData.googleId);

  if (user) {
    // User already exists, return it
    return user;
  }

  // User doesn't exist, create new user
  user = await db.createGoogleUser(userData);
  return user;
};
