-- DropForeignKey
ALTER TABLE "reminders" DROP CONSTRAINT "reminders_category_id_fkey";

-- AlterTable
ALTER TABLE "reminders" ALTER COLUMN "category_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
