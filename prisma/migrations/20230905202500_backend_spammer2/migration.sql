/*
  Warnings:

  - You are about to alter the column `id` on the `Message` table. The data in that column will be cast from `BigInt` to `String`. This cast may fail. Please make sure the data in the column can be cast.

*/
-- RedefineTables
CREATE TABLE "_prisma_new_Message" (
    "id" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "likes" INT4 NOT NULL,
    "parentId" STRING NOT NULL,
    "text" STRING NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);
INSERT INTO "_prisma_new_Message" ("createdAt","id","likes","parentId","text") SELECT "createdAt","id","likes","parentId","text" FROM "Message";
DROP TABLE "Message" CASCADE;
ALTER TABLE "_prisma_new_Message" RENAME TO "Message";
