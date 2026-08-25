-- CreateTable
CREATE TABLE "WidgetArea" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "WidgetArea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Widget" (
  "id" TEXT NOT NULL,
  "areaId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "enabled" BOOLEAN NOT NULL DEFAULT true,
  "order" INTEGER NOT NULL DEFAULT 0,
  "config" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Widget_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WidgetArea_slug_key" ON "WidgetArea"("slug");

-- CreateIndex
CREATE INDEX "Widget_areaId_idx" ON "Widget"("areaId");

CREATE INDEX "Widget_enabled_idx" ON "Widget"("enabled");

CREATE INDEX "Widget_order_idx" ON "Widget"("order");

-- AddForeignKey
ALTER TABLE "Widget"
ADD CONSTRAINT "Widget_areaId_fkey"
FOREIGN KEY ("areaId") REFERENCES "WidgetArea"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
