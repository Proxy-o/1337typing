-- CreateTable
CREATE TABLE "Typing_User" (
    "id" SERIAL NOT NULL,
    "login" TEXT NOT NULL,
    "score" INTEGER,
    "profileUrl" TEXT,
    "avatar_url" TEXT,

    CONSTRAINT "Typing_User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Typing_User_login_key" ON "Typing_User"("login");
