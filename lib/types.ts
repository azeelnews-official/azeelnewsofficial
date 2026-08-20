export type CategorySlug =
  | "india"
  | "world"
  | "politics"
  | "business"
  | "technology"
  | "sports"
  | "entertainment"
  | "health"
  | "explainers";

export interface Category {
  slug: CategorySlug;
  label: string;
  labelHi: string;
}

export interface Author {
  name: string;
  slug: string;
  role: string;
  avatarUrl: string;
}

export interface Article {
  id: string;
  slug: string;
  headline: string;
  headlineHi?: string;
  dek: string;
  dekHi?: string;
  category: CategorySlug;
  author: Author;
  publishedAt: string;
  updatedAt: string;
  readingTimeMin: number;
  imageUrl: string;
  imageAlt: string;
  isLive?: boolean;
  isBreaking?: boolean;
  views?: number;
  tags?: string[];
  body?: string[];
  bodyHi?: string[];
  location?: string;
}

export interface Comment {
  id: string;
  articleId: string;
  authorName: string;
  postedAt: string;
  text: string;
  likes: number;
  liked: boolean;
  canDelete: boolean;
  status: "approved" | "pending" | "spam";
}

export interface TickerItem {
  id: string;
  text: string;
  href: string;
}