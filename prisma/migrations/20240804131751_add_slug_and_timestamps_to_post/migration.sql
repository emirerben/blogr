-- AlterTable
ALTER TABLE "Post" ADD COLUMN "slug" TEXT;
ALTER TABLE "Post" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Post" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Update existing rows to set a slug
UPDATE "Post" SET "slug" = LOWER(REPLACE(title, ' ', '-'));

-- Make slug unique and not null
ALTER TABLE "Post" ALTER COLUMN "slug" SET NOT NULL;
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");