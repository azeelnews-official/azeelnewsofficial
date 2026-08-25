import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const ALLOWED_ROLES = ["EDITOR", "ADMIN"];

async function authorize() {
  const session = await getCurrentSession();

  if (!session || !ALLOWED_ROLES.includes(session.role)) {
    return null;
  }

  return session;
}

export async function GET() {
  const session = await authorize();

  if (!session) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const areas = await prisma.widgetArea.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      widgets: {
        orderBy: { order: "asc" },
      },
    },
  });

  return NextResponse.json({ areas });
}

export async function PATCH(req: Request) {
  const session = await authorize();

  if (!session) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  let payload: {
    widgetId?: string;
    enabled?: boolean;
    order?: number;
    areaId?: string;
    orderedWidgetIds?: string[];
  };

  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  if (
    payload.areaId &&
    Array.isArray(payload.orderedWidgetIds)
  ) {
    const area = await prisma.widgetArea.findUnique({
      where: { id: payload.areaId },
      include: {
        widgets: {
          select: { id: true },
        },
      },
    });

    if (!area) {
      return NextResponse.json(
        { error: "Widget area not found." },
        { status: 404 }
      );
    }

    const existingIds = new Set(area.widgets.map((widget) => widget.id));
    const requestedIds = payload.orderedWidgetIds;

    if (
      requestedIds.length !== area.widgets.length ||
      requestedIds.some((id) => !existingIds.has(id)) ||
      new Set(requestedIds).size !== requestedIds.length
    ) {
      return NextResponse.json(
        { error: "Invalid widget ordering for this area." },
        { status: 400 }
      );
    }

    await prisma.$transaction(
      requestedIds.map((id, index) =>
        prisma.widget.update({
          where: { id },
          data: { order: index },
        })
      )
    );

    const widgets = await prisma.widget.findMany({
      where: { areaId: payload.areaId },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ widgets });
  }

  if (!payload.widgetId) {
    return NextResponse.json(
      { error: "widgetId is required." },
      { status: 400 }
    );
  }

  const data: { enabled?: boolean; order?: number } = {};

  if (typeof payload.enabled === "boolean") {
    data.enabled = payload.enabled;
  }

  if (typeof payload.order === "number" && Number.isInteger(payload.order)) {
    data.order = payload.order;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json(
      { error: "Nothing to update." },
      { status: 400 }
    );
  }

  const widget = await prisma.widget.update({
    where: { id: payload.widgetId },
    data,
  });

  return NextResponse.json({ widget });
}

export async function POST(req: Request) {
  const session = await authorize();

  if (!session) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  let payload: {
    area?: {
      name: string;
      slug: string;
    };
    widgets?: Array<{
      name: string;
      slug: string;
      enabled?: boolean;
      order?: number;
    }>;
  };

  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  if (!payload.area?.name?.trim() || !payload.area?.slug?.trim()) {
    return NextResponse.json(
      { error: "Area name and slug are required." },
      { status: 400 }
    );
  }

  const existingArea = await prisma.widgetArea.findUnique({
    where: { slug: payload.area.slug.trim() },
  });

  if (existingArea) {
    return NextResponse.json(
      { error: "Widget area already exists." },
      { status: 409 }
    );
  }

  const area = await prisma.widgetArea.create({
    data: {
      name: payload.area.name.trim(),
      slug: payload.area.slug.trim(),
      widgets: {
        create: (payload.widgets ?? []).map((widget, index) => ({
          name: widget.name.trim(),
          slug: widget.slug.trim(),
          enabled: widget.enabled ?? true,
          order: widget.order ?? index,
        })),
      },
    },
    include: {
      widgets: {
        orderBy: { order: "asc" },
      },
    },
  });

  return NextResponse.json({ area }, { status: 201 });
}
