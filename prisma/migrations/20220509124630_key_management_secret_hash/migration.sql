/*
  Warnings:

  - Added the required column `secretHash` to the `KeyManagment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "KeyManagment" ADD COLUMN     "secretHash" TEXT NOT NULL;
