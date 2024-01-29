/*
  Warnings:

  - You are about to drop the column `cover_url` on the `users` table. All the data in the column will be lost.
  - Added the required column `avatar_url` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "cover_url",
ADD COLUMN     "avatar_url" TEXT NOT NULL;
