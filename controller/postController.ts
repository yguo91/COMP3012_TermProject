import * as db from "../db";

// Make calls to your db from this file!
async function getPosts(n: number = 5, sub?: string) {
  return db.getPosts(n, sub);
}

export { getPosts };
