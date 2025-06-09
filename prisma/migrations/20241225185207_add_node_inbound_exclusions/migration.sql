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
ALTER TABLE "nodes_traffic_usage_history" ALTER COLUMN "reset_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "nodes_usage_history" ALTER COLUMN "created_at" SET DEFAULT date_trunc('hour', now());

-- AlterTable
ALTER TABLE "nodes_user_usage_history" ALTER COLUMN "created_at" SET DEFAULT date_trunc('hour', now());

-- AlterTable
ALTER TABLE "user_traffic_history" ALTER COLUMN "reset_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT now(),
ALTER COLUMN "updated_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "xray_config" ALTER COLUMN "updated_at" SET DEFAULT now();

-- CreateTable
CREATE TABLE "node_inbound_exclusions" (
    "node_uuid" UUID NOT NULL,
    "inbound_uuid" UUID NOT NULL,

    CONSTRAINT "node_inbound_exclusions_pkey" PRIMARY KEY ("node_uuid","inbound_uuid")
);

-- AddForeignKey
ALTER TABLE "node_inbound_exclusions" ADD CONSTRAINT "node_inbound_exclusions_node_uuid_fkey" FOREIGN KEY ("node_uuid") REFERENCES "nodes"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "node_inbound_exclusions" ADD CONSTRAINT "node_inbound_exclusions_inbound_uuid_fkey" FOREIGN KEY ("inbound_uuid") REFERENCES "inbounds"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
