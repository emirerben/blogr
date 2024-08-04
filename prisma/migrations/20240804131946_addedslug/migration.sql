-- DropIndex
DROP INDEX "Post_slug_key";

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "slug" DROP NOT NULL;
