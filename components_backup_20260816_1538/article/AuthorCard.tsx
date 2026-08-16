import Image from "next/image";
import Link from "next/link";
import type { Author } from "@/lib/types";

export function AuthorCard({ author }: { author: Author }) {
  return (
    <Link href={`/author/${author.slug}`} className="group flex items-center gap-3">
      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-ink-100">
        <Image src={author.avatarUrl} alt={author.name} fill sizes="44px" className="object-cover" />
      </div>
      <div>
        <p className="text-sm font-semibold text-ink-950 group-hover:text-azeel-dark">{author.name}</p>
        <p className="text-xs text-ink-300">{author.role}</p>
      </div>
    </Link>
  );
}
