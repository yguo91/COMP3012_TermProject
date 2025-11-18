-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uname" TEXT NOT NULL,
    "password" TEXT,
    "googleId" TEXT,
    "name" TEXT,
    "email" TEXT
);
INSERT INTO "new_User" ("id", "password", "uname") SELECT "id", "password", "uname" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_uname_key" ON "User"("uname");
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
