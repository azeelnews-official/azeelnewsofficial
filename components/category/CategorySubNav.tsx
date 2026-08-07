import Link from "next/link";
import { categories } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { CategorySlug } from "@/lib/types";

export function CategorySubNav({ active }: { active: CategorySlug }) {
  return (
    <nav aria-label="Categories" className="-mx-4 mb-8 overflow-x-auto border-b border-hairline px-4">
      <ul className="flex w-max gap-1">
        {categories.map((cat) => (
          <li key={cat.slug}>
            <Link
              href={`/category/${cat.slug}`}
              aria-current={cat.slug === active ? "page" : undefined}
              className={cn(
                "block whitespace-nowrap border-b-2 px-3.5 py-3 text-sm font-semibold uppercase tracking-wide transition-colors",
                cat.slug === active
                  ? "border-press text-ink-950"
                  : "border-transparent text-ink-300 hover:text-ink-800"
              )}
            >
              {cat.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
