-- CreateTable
CREATE TABLE "users" (
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "subscription_uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "short_uuid" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "used_traffic_bytes" BIGINT NOT NULL DEFAULT 0,
    "traffic_limit_bytes" BIGINT NOT NULL DEFAULT 0,
    "traffic_limit_strategy" TEXT NOT NULL DEFAULT 'fixed',
    "sub_last_user_agent" TEXT,
    "sub_last_opened_at" TIMESTAMP(3),
    "expire_at" TIMESTAMP(3) NOT NULL,
    "online_at" TIMESTAMP(3),
    "sub_revoked_at" TIMESTAMP(3),
    "last_traffic_reset_at" TIMESTAMP(3),
    "trojan_password" TEXT NOT NULL,
    "vless_uuid" UUID NOT NULL,
    "ss_password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(),

    CONSTRAINT "users_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "api_tokens" (
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "token" TEXT NOT NULL,
    "token_name" TEXT NOT NULL,
    "token_description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(),

    CONSTRAINT "api_tokens_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "keygen" (
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "priv_key" TEXT NOT NULL,
    "pub_key" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(),

    CONSTRAINT "keygen_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "nodes" (
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "port" INTEGER,
    "is_connected" BOOLEAN NOT NULL DEFAULT false,
    "is_connecting" BOOLEAN NOT NULL DEFAULT false,
    "is_disabled" BOOLEAN NOT NULL DEFAULT false,
    "is_node_online" BOOLEAN NOT NULL DEFAULT false,
    "is_xray_running" BOOLEAN NOT NULL DEFAULT false,
    "last_status_change" TIMESTAMP(3),
    "last_status_message" TEXT,
    "xray_version" TEXT,
    "is_traffic_tracking_active" BOOLEAN NOT NULL DEFAULT false,
    "traffic_reset_day" INTEGER DEFAULT 0,
    "traffic_limit_bytes" BIGINT DEFAULT 0,
    "traffic_used_bytes" BIGINT DEFAULT 0,
    "notify_percent" INTEGER DEFAULT 0,
    "cpu_count" INTEGER,
    "cpu_model" TEXT,
    "total_ram" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(),

    CONSTRAINT "nodes_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "nodes_traffic_usage_history" (
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "node_uuid" UUID NOT NULL,
    "traffic_bytes" BIGINT NOT NULL,
    "reset_at" TIMESTAMP(3) NOT NULL DEFAULT now(),

    CONSTRAINT "nodes_traffic_usage_history_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "nodes_user_usage_history" (
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "node_uuid" UUID NOT NULL,
    "user_uuid" UUID NOT NULL,
    "download_bytes" BIGINT NOT NULL,
    "upload_bytes" BIGINT NOT NULL,
    "total_bytes" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT date_trunc('hour', now()),

    CONSTRAINT "nodes_user_usage_history_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "nodes_usage_history" (
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "node_uuid" UUID NOT NULL,
    "download_bytes" BIGINT NOT NULL,
    "upload_bytes" BIGINT NOT NULL,
    "total_bytes" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT date_trunc('hour', now()),

    CONSTRAINT "nodes_usage_history_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "user_traffic_history" (
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_uuid" UUID NOT NULL,
    "used_bytes" BIGINT NOT NULL,
    "reset_at" TIMESTAMP(3) NOT NULL DEFAULT now(),

    CONSTRAINT "user_traffic_history_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "xray_config" (
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "config" JSONB,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(),

    CONSTRAINT "xray_config_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "inbounds" (
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tag" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "inbounds_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "hosts" (
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "inbound_uuid" UUID NOT NULL,
    "view_position" SERIAL NOT NULL,
    "remark" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "path" TEXT,
    "sni" TEXT,
    "host" TEXT,
    "alpn" TEXT,
    "fingerprint" TEXT,
    "allowinsecure" BOOLEAN NOT NULL DEFAULT false,
    "is_disabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "hosts_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "active_user_inbounds" (
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_uuid" UUID NOT NULL,
    "inbound_uuid" UUID NOT NULL,

    CONSTRAINT "active_user_inbounds_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_subscription_uuid_key" ON "users"("subscription_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "users_short_uuid_key" ON "users"("short_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "api_tokens_token_key" ON "api_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "nodes_name_key" ON "nodes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "nodes_address_key" ON "nodes"("address");

-- CreateIndex
CREATE UNIQUE INDEX "nodes_user_usage_history_node_uuid_user_uuid_created_at_key" ON "nodes_user_usage_history"("node_uuid", "user_uuid", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "nodes_usage_history_node_uuid_created_at_key" ON "nodes_usage_history"("node_uuid", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "inbounds_tag_key" ON "inbounds"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "hosts_remark_key" ON "hosts"("remark");

-- CreateIndex
CREATE UNIQUE INDEX "active_user_inbounds_user_uuid_inbound_uuid_key" ON "active_user_inbounds"("user_uuid", "inbound_uuid");

-- AddForeignKey
ALTER TABLE "nodes_traffic_usage_history" ADD CONSTRAINT "nodes_traffic_usage_history_node_uuid_fkey" FOREIGN KEY ("node_uuid") REFERENCES "nodes"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nodes_user_usage_history" ADD CONSTRAINT "nodes_user_usage_history_node_uuid_fkey" FOREIGN KEY ("node_uuid") REFERENCES "nodes"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nodes_user_usage_history" ADD CONSTRAINT "nodes_user_usage_history_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nodes_usage_history" ADD CONSTRAINT "nodes_usage_history_node_uuid_fkey" FOREIGN KEY ("node_uuid") REFERENCES "nodes"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_traffic_history" ADD CONSTRAINT "user_traffic_history_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hosts" ADD CONSTRAINT "hosts_inbound_uuid_fkey" FOREIGN KEY ("inbound_uuid") REFERENCES "inbounds"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "active_user_inbounds" ADD CONSTRAINT "active_user_inbounds_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "active_user_inbounds" ADD CONSTRAINT "active_user_inbounds_inbound_uuid_fkey" FOREIGN KEY ("inbound_uuid") REFERENCES "inbounds"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
