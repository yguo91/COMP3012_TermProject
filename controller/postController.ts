import * as db from "../db";

// Make calls to your db from this file!
async function getPosts(n = 5, sub = undefined) {
  return db.getPosts(n, sub);
}

export { getPosts };
