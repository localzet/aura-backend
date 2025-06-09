/*
  Warnings:

  - The primary key for the `active_user_inbounds` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `uuid` on the `active_user_inbounds` table. All the data in the column will be lost.
  - The primary key for the `nodes_traffic_usage_history` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `uuid` on the `nodes_traffic_usage_history` table. All the data in the column will be lost.
  - The primary key for the `nodes_usage_history` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `uuid` on the `nodes_usage_history` table. All the data in the column will be lost.
  - The primary key for the `nodes_user_usage_history` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `uuid` on the `nodes_user_usage_history` table. All the data in the column will be lost.
  - The primary key for the `user_traffic_history` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `uuid` on the `user_traffic_history` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "active_user_inbounds_user_uuid_inbound_uuid_key";

-- DropIndex
DROP INDEX "nodes_usage_history_node_uuid_created_at_key";

-- DropIndex
DROP INDEX "nodes_user_usage_history_node_uuid_user_uuid_created_at_key";

-- AlterTable
ALTER TABLE "active_user_inbounds" DROP CONSTRAINT "active_user_inbounds_pkey",
DROP COLUMN "uuid",
ADD CONSTRAINT "active_user_inbounds_pkey" PRIMARY KEY ("user_uuid", "inbound_uuid");

-- AlterTable
ALTER TABLE "admin" ALTER COLUMN "created_at" SET DEFAULT now(),
ALTER COLUMN "updated_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "api_tokens" ALTER COLUMN "created_at" SET DEFAULT now(),
ALTER COLUMN "updated_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "keygen" ALTER COLUMN "created_at" SET DEFAULT now(),
ALTER COLUMN "updated_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "nodes" ALTER COLUMN "created_at" SET DEFAULT now(),
ALTER COLUMN "updated_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "nodes_traffic_usage_history" DROP CONSTRAINT "nodes_traffic_usage_history_pkey",
DROP COLUMN "uuid",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
ALTER COLUMN "reset_at" SET DEFAULT now(),
ADD CONSTRAINT "nodes_traffic_usage_history_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "nodes_usage_history" DROP CONSTRAINT "nodes_usage_history_pkey",
DROP COLUMN "uuid",
ALTER COLUMN "created_at" SET DEFAULT date_trunc('hour', now()),
ADD CONSTRAINT "nodes_usage_history_pkey" PRIMARY KEY ("node_uuid", "created_at");

-- AlterTable
ALTER TABLE "nodes_user_usage_history" DROP CONSTRAINT "nodes_user_usage_history_pkey",
DROP COLUMN "uuid",
ALTER COLUMN "created_at" SET DEFAULT date_trunc('hour', now()),
ALTER COLUMN "updated_at" SET DEFAULT now(),
ADD CONSTRAINT "nodes_user_usage_history_pkey" PRIMARY KEY ("node_uuid", "user_uuid", "created_at");

-- AlterTable
ALTER TABLE "subscription_settings" ALTER COLUMN "created_at" SET DEFAULT now(),
ALTER COLUMN "updated_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "subscription_templates" ALTER COLUMN "created_at" SET DEFAULT now(),
ALTER COLUMN "updated_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "user_traffic_history" DROP CONSTRAINT "user_traffic_history_pkey",
DROP COLUMN "uuid",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
ALTER COLUMN "reset_at" SET DEFAULT now(),
ADD CONSTRAINT "user_traffic_history_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT now(),
ALTER COLUMN "updated_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "xray_config" ALTER COLUMN "updated_at" SET DEFAULT now();
