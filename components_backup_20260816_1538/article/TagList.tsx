import Link from "next/link";

export function TagList({ tags }: { tags: string[] }) {
  if (!tags.length) return null;
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Article tags">
      {tags.map((tag) => (
        <li key={tag}>
          <Link
            href={`/topic/${tag.toLowerCase().replace(/\s+/g, "-")}`}
            className="inline-block rounded-full border border-hairline px-3 py-1 text-xs font-medium text-ink-600 transition-colors hover:border-azeel hover:text-azeel-dark"
          >
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}
