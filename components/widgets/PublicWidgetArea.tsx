import { AdSlot } from "@/components/home/AdSlot";
import { TrendingSidebar } from "@/components/home/TrendingSidebar";
import { NewsletterInline } from "@/components/article/NewsletterInline";
import { RelatedArticles } from "@/components/article/RelatedArticles";
import { getWidgets } from "@/lib/data/widgets";
import type { Article } from "@/lib/types";

type WidgetArea = "home-sidebar" | "article-sidebar";

interface PublicWidgetAreaProps {
  area: WidgetArea;
  articles?: Article[];
}

export async function PublicWidgetArea({
  area,
  articles = [],
}: PublicWidgetAreaProps) {
  const areas = await getWidgets();
  const currentArea = areas.find((item) => item.slug === area);

  if (!currentArea) return null;

  return (
    <div className="space-y-5">
      {currentArea.widgets
        .filter((widget) => widget.enabled)
        .sort((a, b) => a.order - b.order)
        .map((widget) => {
          switch (widget.slug) {
            case "trending-now":
              return (
                <TrendingSidebar
                  key={widget.id}
                  articles={articles}
                />
              );

            case "ad-slot-sidebar":
              return <AdSlot key={widget.id} size="sidebar" />;

            case "newsletter-signup":
              return <NewsletterInline key={widget.id} />;

            case "related-topics":
              return articles.length > 0 ? (
                <RelatedArticles
                  key={widget.id}
                  articles={articles}
                />
              ) : null;

            default:
              return null;
          }
        })}
    </div>
  );
}
