/*
  Warnings:

  - Added the required column `masterKeyIv` to the `KeyManagment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "KeyManagment" ADD COLUMN     "masterKeyIv" TEXT NOT NULL;
