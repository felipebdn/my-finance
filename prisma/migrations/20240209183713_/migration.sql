-- DropForeignKey
ALTER TABLE "reminders" DROP CONSTRAINT "reminders_account_id_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_account_id_fkey";

-- DropForeignKey
ALTER TABLE "transfers" DROP CONSTRAINT "transfers_destiny_id_fkey";

-- DropForeignKey
ALTER TABLE "transfers" DROP CONSTRAINT "transfers_referent_id_fkey";

-- AlterTable
ALTER TABLE "reminders" ALTER COLUMN "account_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "account_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "transfers" ALTER COLUMN "destiny_id" DROP NOT NULL,
ALTER COLUMN "referent_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_destiny_id_fkey" FOREIGN KEY ("destiny_id") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_referent_id_fkey" FOREIGN KEY ("referent_id") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
