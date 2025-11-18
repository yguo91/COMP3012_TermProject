import * as db from "../db";

export const getUserByEmailIdAndPassword = async (
  uname: string,
  password: string
) => {
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

export const getUserById = async (id: number) => {
  let user = await db.getUser(Number(id));
  if (user) {
    return user;
  }
  return null;
};
