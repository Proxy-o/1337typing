/*
  Warnings:

  - You are about to drop the `Typing_User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Typing_User";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "login" TEXT NOT NULL,
    "score" INTEGER,
    "profileUrl" TEXT,
    "avatar_url" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");
