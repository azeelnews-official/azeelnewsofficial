import type { Article, Category, Comment, TickerItem } from "./types";

export const categories: Category[] = [
  { slug: "india", label: "India", labelHi: "भारत" },
  { slug: "world", label: "World", labelHi: "विश्व" },
  { slug: "politics", label: "Politics", labelHi: "राजनीति" },
  { slug: "business", label: "Business", labelHi: "व्यापार" },
  { slug: "technology", label: "Technology", labelHi: "तकनीक" },
  { slug: "sports", label: "Sports", labelHi: "खेल" },
  { slug: "entertainment", label: "Entertainment", labelHi: "मनोरंजन" },
  { slug: "health", label: "Health", labelHi: "स्वास्थ्य" },
  { slug: "explainers", label: "Explainers", labelHi: "व्याख्या" },
];

const author = (name: string, role: string, seed: string) => ({
  name,
  slug: name.toLowerCase().replace(/\s+/g, "-"),
  role,
  avatarUrl: `https://images.unsplash.com/photo-${seed}?w=80&h=80&fit=crop&crop=faces`,
});

const authors = {
  meera: author("Meera Nair", "Senior Correspondent", "1494790108377-be9c29b29330"),
  arjun: author("Arjun Kapoor", "Political Editor", "1500648767791-00dcc994a43e"),
  sana: author("Sana Iyer", "Business Desk", "1438761681033-6461ffad8d80"),
  rohit: author("Rohit Verma", "Technology Editor", "1472099645785-5658abf4ff4e"),
};

const img = (seed: string) =>
  `https://images.unsplash.com/photo-${seed}?w=1200&h=800&fit=crop`;

export const heroArticle: Article = {
  id: "a-1001",
  slug: "parliament-passes-digital-governance-bill",
  headline: "Parliament Clears Digital Governance Bill After 14-Hour Debate",
  dek: "The bill establishes a unified data-protection authority and sets new compliance timelines for public and private platforms.",
  category: "politics",
  author: authors.arjun,
  publishedAt: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
  updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  readingTimeMin: 6,
  imageUrl: img("1591696205602-2f950c417cb9"),
  imageAlt: "Parliament House exterior at dusk",
  isBreaking: true,
  location: "NEW DELHI",
  views: 184000,
  tags: ["Parliament", "Data Protection", "Policy", "Digital Governance"],
  body: [
    "The bill passed in a late-night sitting after members from both sides of the aisle pressed for changes to the enforcement timeline. The final text extends the compliance window for small and medium platforms from six months to one year, a concession that appeared to break the deadlock in Wednesday's session.",
    "At the center of the legislation is a new statutory authority tasked with overseeing how companies collect, store, and share personal data. The authority will have the power to levy penalties tied to a company's annual turnover, a structure that mirrors frameworks already in place in other major economies.",
    "Industry groups had lobbied for a longer transition period, arguing that smaller firms lack the compliance infrastructure of larger platforms. The revised timeline was described by one industry association as workable, though several members said they would seek further clarity on cross-border data transfer rules once the authority issues its first set of guidelines.",
    "Opposition members who had opposed early drafts of the bill said the revised version addressed most of their concerns around judicial oversight of enforcement actions. A standing committee will review the authority's first annual report, expected within eighteen months of the bill receiving presidential assent.",
    "The legislation now moves to the upper house, where it is expected to be taken up in the next sitting. If cleared without further amendments, the authority could begin operations as early as the first quarter of next year.",
  ],
};

export const topStories: Article[] = [
  {
    id: "a-1002",
    slug: "rbi-holds-repo-rate-steady",
    headline: "RBI Holds Repo Rate Steady, Signals Watchful Stance on Inflation",
    dek: "The central bank's monetary policy committee voted 5-1 to keep rates unchanged for a third consecutive quarter.",
    category: "business",
    author: authors.sana,
    publishedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    readingTimeMin: 4,
    imageUrl: img("1611974789855-9c2a0a7236a3"),
    imageAlt: "Reserve Bank of India building",
    views: 92000,
    location: "MUMBAI",
    tags: ["RBI", "Monetary Policy", "Inflation", "Interest Rates"],
    body: [
      "The Reserve Bank's monetary policy committee voted five to one to hold the benchmark repo rate steady, extending a pause that has now stretched across three consecutive reviews. The lone dissent came from an external member who had pushed for a quarter-point cut.",
      "In its accompanying statement, the committee flagged food-price volatility as the primary risk to the inflation outlook, while noting that core inflation has remained within the target band for five straight months.",
      "Economists at several brokerages said the decision was in line with expectations, though a few had flagged a small probability of a cut given softer industrial output data released earlier in the week.",
      "The central bank governor said future decisions would remain data-dependent, with the committee's next scheduled review set for early next quarter.",
    ],
  },
  {
    id: "a-1003",
    slug: "isro-lunar-sample-return-mission",
    headline: "ISRO Sets 2027 Window for Lunar Sample-Return Mission",
    dek: "Chandrayaan-4 will attempt India's first robotic sample return, building on the Vikram lander's descent systems.",
    category: "technology",
    author: authors.rohit,
    publishedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    readingTimeMin: 5,
    imageUrl: img("1446776653964-20c1d3a81b06"),
    imageAlt: "Rocket launch at night",
    views: 143000,
    location: "BENGALURU",
    tags: ["ISRO", "Space", "Chandrayaan", "Science"],
    body: [
      "The Indian Space Research Organisation has set a 2027 launch window for its next lunar mission, which will attempt to become the country's first robotic sample-return flight. The mission builds directly on the descent and landing systems validated during the earlier Vikram lander touchdown.",
      "Officials described the sample-return architecture as the most complex the agency has attempted, involving a lunar ascent stage, an orbital rendezvous, and a re-entry capsule designed to survive high-speed atmospheric entry.",
      "The agency said design reviews for the ascent vehicle are complete and that integration testing would begin later this year at its satellite propulsion facility.",
      "A successful mission would place the country among a small group of nations to have returned lunar samples to Earth using an uncrewed spacecraft.",
    ],
  },
  {
    id: "a-1004",
    slug: "monsoon-forecast-revised-upward",
    headline: "IMD Revises Monsoon Forecast Upward for Central India",
    dek: "Above-normal rainfall is expected across the Deccan plateau through August, easing early-season reservoir deficits.",
    category: "india",
    author: authors.meera,
    publishedAt: new Date(Date.now() - 7 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 3600 * 1000).toISOString(),
    readingTimeMin: 3,
    imageUrl: img("1428592953211-077101b2021b"),
    imageAlt: "Monsoon clouds over farmland",
    views: 61000,
  },
];

export const trending: Article[] = [
  {
    id: "a-2001",
    slug: "test-series-selection-committee-picks",
    headline: "Selection Committee Names Squad for Home Test Series",
    dek: "Two uncapped players earn maiden call-ups ahead of the opening Test next month.",
    category: "sports",
    author: authors.meera,
    publishedAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    readingTimeMin: 3,
    imageUrl: img("1531415074968-036ba1b575da"),
    imageAlt: "Cricket stadium floodlights",
    views: 77000,
  },
  {
    id: "a-2002",
    slug: "streaming-platform-regional-content-push",
    headline: "Streaming Platforms Ramp Up Regional-Language Originals",
    dek: "Four major services announce a combined slate of 38 regional titles for the coming year.",
    category: "entertainment",
    author: authors.sana,
    publishedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    readingTimeMin: 4,
    imageUrl: img("1489599162946-2dd5e40e1f7f"),
    imageAlt: "Film set clapperboard",
    views: 54000,
  },
  {
    id: "a-2003",
    slug: "heat-advisory-northern-plains",
    headline: "Heat Advisory Issued for Northern Plains Through the Weekend",
    dek: "Health authorities advise limiting outdoor activity during peak afternoon hours in seven states.",
    category: "health",
    author: authors.meera,
    publishedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    readingTimeMin: 2,
    imageUrl: img("1504370805625-d32c54b16100"),
    imageAlt: "Heat haze over a road",
    views: 39000,
  },
  {
    id: "a-2004",
    slug: "explainer-new-data-protection-authority",
    headline: "Explainer: What the New Data-Protection Authority Actually Does",
    dek: "A plain-language walkthrough of enforcement powers, penalties, and compliance deadlines.",
    category: "explainers",
    author: authors.arjun,
    publishedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    readingTimeMin: 7,
    imageUrl: img("1450101499163-c8848c66ca85"),
    imageAlt: "Person reading documents at a desk",
    views: 48000,
  },
];

export const categoryFeeds: Record<CategoryFeedKey, Article[]> = {
  world: [
    {
      id: "a-3001",
      slug: "trade-corridor-agreement-signed",
      headline: "Three Nations Sign Framework for New Trade Corridor",
      dek: "The agreement outlines shared port infrastructure and simplified customs processing.",
      category: "world",
      author: authors.arjun,
      publishedAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
      readingTimeMin: 4,
      imageUrl: img("1436450412740-6b988f486c6b"),
      imageAlt: "Container port at sunrise",
      views: 28000,
    },
    {
      id: "a-3002",
      slug: "central-bank-currency-intervention",
      headline: "Central Bank Intervenes to Steady Currency After Sharp Slide",
      dek: "Policymakers cite external volatility rather than domestic fundamentals for the move.",
      category: "world",
      author: authors.sana,
      publishedAt: new Date(Date.now() - 9 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 9 * 3600 * 1000).toISOString(),
      readingTimeMin: 3,
      imageUrl: img("1591123120675-6f7f1aae0e5b"),
      imageAlt: "Financial district skyline",
      views: 22000,
    },
    {
      id: "a-3003",
      slug: "climate-summit-preparatory-talks",
      headline: "Preparatory Talks Open Ahead of Year-End Climate Summit",
      dek: "Negotiators aim to narrow gaps on finance commitments before the main session.",
      category: "world",
      author: authors.meera,
      publishedAt: new Date(Date.now() - 11 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 11 * 3600 * 1000).toISOString(),
      readingTimeMin: 5,
      imageUrl: img("1569163139394-de4798aa62b6"),
      imageAlt: "Conference hall with delegates",
      views: 19000,
    },
  ],
  business: topStories.filter((a) => a.category === "business").concat([
    {
      id: "a-3004",
      slug: "startup-funding-rebounds-q2",
      headline: "Startup Funding Rebounds in Q2 After Five-Quarter Slump",
      dek: "Early-stage rounds led the recovery, with fintech and climate-tech drawing the most capital.",
      category: "business",
      author: authors.sana,
      publishedAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
      readingTimeMin: 4,
      imageUrl: img("1553729459-efe14ef6055d"),
      imageAlt: "Team meeting around a laptop",
      views: 31000,
    },
  ]),
  technology: topStories.filter((a) => a.category === "technology").concat([
    {
      id: "a-3005",
      slug: "domestic-chip-fab-groundbreaking",
      headline: "Groundbreaking Held for Second Domestic Chip Fabrication Plant",
      dek: "The facility targets mature-node production for automotive and industrial clients by 2028.",
      category: "technology",
      author: authors.rohit,
      publishedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
      readingTimeMin: 4,
      imageUrl: img("1518770660439-4636190af475"),
      imageAlt: "Semiconductor cleanroom",
      views: 26000,
    },
  ]),
};

export type CategoryFeedKey = "world" | "business" | "technology";

export const tickerItems: TickerItem[] = [
  { id: "t-1", text: "Sensex opens 210 points higher on IT-stock rally", href: "#" },
  { id: "t-2", text: "Heavy rainfall alert issued for coastal Karnataka", href: "#" },
  { id: "t-3", text: "National highway project clears final environmental approval", href: "#" },
  { id: "t-4", text: "Central bank keeps repo rate unchanged at 6.5%", href: "#" },
  { id: "t-5", text: "Squad announced for upcoming home Test series", href: "#" },
];

export function getCategoryLabel(slug: string): string {
  return categories.find((c) => c.slug === slug)?.label ?? slug;
}

export function getArticlesByCategory(slug: string): Article[] {
  return getAllArticles()
    .filter((a) => a.category === slug)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function searchArticles(query: string): Article[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return getAllArticles()
    .filter(
      (a) =>
        a.headline.toLowerCase().includes(q) ||
        a.dek.toLowerCase().includes(q) ||
        (a.tags ?? []).some((t) => t.toLowerCase().includes(q)) ||
        getCategoryLabel(a.category).toLowerCase().includes(q)
    )
    .sort((a, b) => {
      const aScore = a.headline.toLowerCase().includes(q) ? 0 : 1;
      const bScore = b.headline.toLowerCase().includes(q) ? 0 : 1;
      return aScore - bScore;
    });
}

export const trendingSearches: string[] = [
  "Digital Governance Bill",
  "RBI repo rate",
  "Chandrayaan-4",
  "Monsoon forecast",
  "Test series squad",
];

export type PostStatus = "published" | "draft" | "scheduled";

export interface AdminPost extends Article {
  status: PostStatus;
}

const STATUS_CYCLE: PostStatus[] = ["published", "published", "published", "draft", "scheduled"];

export function getAdminPosts(): AdminPost[] {
  return getAllArticles()
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .map((article, i) => ({ ...article, status: STATUS_CYCLE[i % STATUS_CYCLE.length] ?? "published" }));
}

export function getAdminStats() {
  const posts = getAllArticles();
  const totalViews = posts.reduce((sum, a) => sum + (a.views ?? 0), 0);
  const pendingComments = Object.values(mockComments)
    .flat()
    .filter((c) => c.status === "pending").length;
  return {
    totalPosts: posts.length,
    totalViews,
    pendingComments,
    activeUsers: 48213,
  };
}

export type AdminRole = "reader" | "journalist" | "editor" | "admin";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatarUrl: string;
  joinedAt: string;
  status: "active" | "suspended";
}

export const adminUsers: AdminUser[] = [
  {
    id: "u-1",
    name: "Arjun Kapoor",
    email: "arjun.kapoor@azeelnews.com",
    role: "editor",
    avatarUrl: authors.arjun.avatarUrl,
    joinedAt: "2024-02-11T00:00:00.000Z",
    status: "active",
  },
  {
    id: "u-2",
    name: "Meera Nair",
    email: "meera.nair@azeelnews.com",
    role: "journalist",
    avatarUrl: authors.meera.avatarUrl,
    joinedAt: "2024-05-03T00:00:00.000Z",
    status: "active",
  },
  {
    id: "u-3",
    name: "Sana Iyer",
    email: "sana.iyer@azeelnews.com",
    role: "journalist",
    avatarUrl: authors.sana.avatarUrl,
    joinedAt: "2024-07-19T00:00:00.000Z",
    status: "active",
  },
  {
    id: "u-4",
    name: "Rohit Verma",
    email: "rohit.verma@azeelnews.com",
    role: "journalist",
    avatarUrl: authors.rohit.avatarUrl,
    joinedAt: "2024-09-02T00:00:00.000Z",
    status: "active",
  },
  {
    id: "u-5",
    name: "Priya Sharma",
    email: "priya.sharma@gmail.com",
    role: "reader",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=faces",
    joinedAt: "2025-01-22T00:00:00.000Z",
    status: "active",
  },
  {
    id: "u-6",
    name: "Karan Mehta",
    email: "karan.mehta@gmail.com",
    role: "reader",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=faces",
    joinedAt: "2025-03-14T00:00:00.000Z",
    status: "suspended",
  },
  {
    id: "u-7",
    name: "Alok",
    email: "alok@azeeltechnologies.com",
    role: "admin",
    avatarUrl: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=80&h=80&fit=crop&crop=faces",
    joinedAt: "2023-11-01T00:00:00.000Z",
    status: "active",
  },
];

export const ROLE_PERMISSIONS: Record<AdminRole, { label: string; description: string; permissions: string[] }> = {
  reader: {
    label: "Reader",
    description: "A registered visitor. Can save bookmarks and comment on articles.",
    permissions: ["Bookmark articles", "Post comments", "Manage own profile"],
  },
  journalist: {
    label: "Journalist",
    description: "Writes and submits posts for review. Cannot publish directly.",
    permissions: ["Create & edit own posts", "Save drafts", "Upload media", "Submit for review"],
  },
  editor: {
    label: "Editor",
    description: "Reviews, edits, and publishes any post. Manages categories and tags.",
    permissions: [
      "Everything a Journalist can do",
      "Edit & publish any post",
      "Manage categories & tags",
      "Moderate comments",
    ],
  },
  admin: {
    label: "Admin",
    description: "Full system access, including users, roles, and site settings.",
    permissions: [
      "Everything an Editor can do",
      "Manage users & roles",
      "Manage advertisements & settings",
      "View audit logs & backups",
    ],
  },
};

export function getAllArticles(): Article[] {
  const feedArticles = Object.values(categoryFeeds).flat();
  const byId = new Map<string, Article>();
  for (const a of [heroArticle, ...topStories, ...trending, ...feedArticles]) {
    byId.set(a.id, a);
  }
  return Array.from(byId.values());
}

const FALLBACK_BODY = (a: Article): string[] => [
  a.dek,
  "Reporters are continuing to gather details on this story and this report will be updated as more information becomes available. Readers can check back for the latest developments, or follow the topic to be notified when the story is updated.",
  "AZEEL NEWS follows a strict editorial verification process before publishing developing stories. Every update to this report is time-stamped and material corrections are noted at the top of the article.",
];

export function getArticleBySlug(slug: string): Article | undefined {
  const article = getAllArticles().find((a) => a.slug === slug);
  if (!article) return undefined;
  return article.body ? article : { ...article, body: FALLBACK_BODY(article) };
}

export function getRelatedArticles(article: Article, limit = 4): Article[] {
  return getAllArticles()
    .filter((a) => a.id !== article.id && a.category === article.category)
    .slice(0, limit)
    .concat(
      getAllArticles()
        .filter((a) => a.id !== article.id && a.category !== article.category)
        .slice(0, Math.max(0, limit - 1))
    )
    .slice(0, limit);
}

export function getCategoriesWithCounts() {
  return categories.map((c) => ({ ...c, postCount: getArticlesByCategory(c.slug).length }));
}

export interface TagUsage {
  name: string;
  slug: string;
  postCount: number;
}

export function getTagsWithCounts(): TagUsage[] {
  const counts = new Map<string, number>();
  for (const article of getAllArticles()) {
    for (const tag of article.tags ?? []) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([name, postCount]) => ({ name, slug: name.toLowerCase().replace(/\s+/g, "-"), postCount }))
    .sort((a, b) => b.postCount - a.postCount);
}

export type FactCheckVerdict = "true" | "false" | "misleading" | "unverified";

export interface FactCheckItem {
  id: string;
  claim: string;
  verdict: FactCheckVerdict;
  summary: string;
  publishedAt: string;
}

export const factChecks: FactCheckItem[] = [
  {
    id: "fc-1",
    claim: "\"New data-protection law requires all citizens to register biometric data by December.\"",
    verdict: "false",
    summary: "The Digital Governance Bill does not introduce any new biometric registration requirement. This claim appears to conflate the bill with an unrelated, unconfirmed proposal circulating on social media.",
    publishedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
  },
  {
    id: "fc-2",
    claim: "\"RBI's repo rate has stayed unchanged for over a year.\"",
    verdict: "misleading",
    summary: "The repo rate has been held for three consecutive quarterly reviews (roughly nine months), not over a year. Technically close but the timeframe is exaggerated.",
    publishedAt: new Date(Date.now() - 30 * 3600 * 1000).toISOString(),
  },
  {
    id: "fc-3",
    claim: "\"ISRO has confirmed a crewed lunar mission for 2027.\"",
    verdict: "false",
    summary: "ISRO's 2027 target is for an uncrewed sample-return mission (Chandrayaan-4), not a crewed lunar landing. No crewed lunar mission has been officially scheduled.",
    publishedAt: new Date(Date.now() - 50 * 3600 * 1000).toISOString(),
  },
  {
    id: "fc-4",
    claim: "\"The national highway project received final environmental clearance this week.\"",
    verdict: "true",
    summary: "Confirmed via the Ministry of Environment's public clearance registry, dated this week.",
    publishedAt: new Date(Date.now() - 70 * 3600 * 1000).toISOString(),
  },
];

export interface AdminMediaItem {
  id: string;
  url: string;
  type: "image" | "video";
  altText: string;
  uploadedAt: string;
  usedBy?: string; // article headline, if any
}

export function getMediaLibrary(): AdminMediaItem[] {
  return getAllArticles().map((a) => ({
    id: a.id,
    url: a.imageUrl,
    type: "image",
    altText: a.imageAlt,
    uploadedAt: a.publishedAt,
    usedBy: a.headline,
  }));
}

export type AdPlacement = "leaderboard" | "sidebar" | "inline" | "sticky" | "native";
export type AdCampaignStatus = "active" | "paused" | "ended";

export interface AdCampaign {
  id: string;
  name: string;
  placement: AdPlacement;
  status: AdCampaignStatus;
  imageUrl: string;
  impressions: number;
  clicks: number;
  startDate: string;
  endDate: string;
}

export const adCampaigns: AdCampaign[] = [
  {
    id: "ad-1",
    name: "Festive Sale — Electronics Retailer",
    placement: "leaderboard",
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400&h=100&fit=crop",
    impressions: 482300,
    clicks: 6104,
    startDate: "2026-07-15",
    endDate: "2026-08-31",
  },
  {
    id: "ad-2",
    name: "Two-Wheeler Insurance — Sidebar",
    placement: "sidebar",
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=300&h=250&fit=crop",
    impressions: 210500,
    clicks: 1890,
    startDate: "2026-06-01",
    endDate: "2026-09-30",
  },
  {
    id: "ad-3",
    name: "Airline Monsoon Fares",
    placement: "inline",
    status: "paused",
    imageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=200&fit=crop",
    impressions: 98400,
    clicks: 720,
    startDate: "2026-05-10",
    endDate: "2026-07-10",
  },
  {
    id: "ad-4",
    name: "Streaming Service Launch",
    placement: "sticky",
    status: "ended",
    imageUrl: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=600&h=100&fit=crop",
    impressions: 640200,
    clicks: 9310,
    startDate: "2026-03-01",
    endDate: "2026-04-15",
  },
];

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
  status: "active" | "unsubscribed";
}

export const newsletterSubscribers: NewsletterSubscriber[] = [
  { id: "n-1", email: "priya.sharma@gmail.com", subscribedAt: "2026-06-02", status: "active" },
  { id: "n-2", email: "karan.mehta@gmail.com", subscribedAt: "2026-05-21", status: "active" },
  { id: "n-3", email: "ananya.d@gmail.com", subscribedAt: "2026-04-11", status: "active" },
  { id: "n-4", email: "nikhil.rao@gmail.com", subscribedAt: "2026-03-28", status: "unsubscribed" },
  { id: "n-5", email: "vikram.singh@gmail.com", subscribedAt: "2026-07-09", status: "active" },
];

export interface NewsletterCampaign {
  id: string;
  subject: string;
  sentAt: string;
  recipients: number;
  openRate: number;
}

export const newsletterCampaigns: NewsletterCampaign[] = [
  { id: "camp-1", subject: "Morning Briefing — Digital Governance Bill Clears Parliament", sentAt: "2026-08-01", recipients: 48120, openRate: 42.3 },
  { id: "camp-2", subject: "Weekend Reads: Space, Sport, and the Monsoon Outlook", sentAt: "2026-07-27", recipients: 47850, openRate: 38.9 },
  { id: "camp-3", subject: "Morning Briefing — RBI Holds Rates Steady", sentAt: "2026-07-25", recipients: 47600, openRate: 44.1 },
];

export interface AdminRedirect {
  id: string;
  fromPath: string;
  toPath: string;
  statusCode: 301 | 302 | 307;
}

export const adminRedirects: AdminRedirect[] = [
  { id: "r-1", fromPath: "/india-news", toPath: "/category/india", statusCode: 301 },
  { id: "r-2", fromPath: "/cricket", toPath: "/category/sports", statusCode: 301 },
  { id: "r-3", fromPath: "/old-search", toPath: "/search", statusCode: 302 },
];

export interface MenuItem {
  id: string;
  label: string;
  url: string;
}

export interface AdminMenu {
  id: string;
  name: string;
  items: MenuItem[];
}

export const adminMenus: AdminMenu[] = [
  {
    id: "menu-primary",
    name: "Primary Navigation",
    items: categories.slice(0, 6).map((c, i) => ({ id: `pm-${i}`, label: c.label, url: `/category/${c.slug}` })),
  },
  {
    id: "menu-footer",
    name: "Footer — Company",
    items: [
      { id: "fm-1", label: "About Us", url: "/about" },
      { id: "fm-2", label: "Contact Us", url: "/contact" },
      { id: "fm-3", label: "Advertise With Us", url: "/advertise" },
      { id: "fm-4", label: "Careers", url: "/careers" },
    ],
  },
];

export interface AdminPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  updatedAt: string;
}

export const adminPages: AdminPage[] = [
  {
    id: "page-about",
    slug: "about",
    title: "About Us",
    content: "AZEEL NEWS is an independent digital news publication covering India and the world.",
    updatedAt: "2026-06-12",
  },
  {
    id: "page-contact",
    slug: "contact",
    title: "Contact Us",
    content: "Reach the editorial desk at editor@azeelnews.com.",
    updatedAt: "2026-05-30",
  },
  {
    id: "page-advertise",
    slug: "advertise",
    title: "Advertise With Us",
    content: "For media kits and rate cards, contact ads@azeelnews.com.",
    updatedAt: "2026-04-18",
  },
  {
    id: "page-privacy",
    slug: "privacy-policy",
    title: "Privacy Policy",
    content: "This policy explains what data AZEEL NEWS collects and how it is used.",
    updatedAt: "2026-03-02",
  },
  {
    id: "page-terms",
    slug: "terms",
    title: "Terms of Use",
    content: "By using AZEEL NEWS, you agree to the following terms.",
    updatedAt: "2026-03-02",
  },
];

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

export const adminNotifications: AppNotification[] = [
  { id: "notif-1", title: "New comment pending review", body: "guest_2291 commented on the Digital Governance Bill story", createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(), read: false },
  { id: "notif-2", title: "Post scheduled", body: "\"Heat Advisory Issued for Northern Plains\" is scheduled for tomorrow, 7:00 AM", createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(), read: false },
  { id: "notif-3", title: "Ad campaign ending soon", body: "\"Airline Monsoon Fares\" ends in 2 days", createdAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString(), read: false },
  { id: "notif-4", title: "New user registered", body: "Priya Sharma joined as a Reader", createdAt: new Date(Date.now() - 30 * 3600 * 1000).toISOString(), read: true },
];

export const readerNotifications: AppNotification[] = [
  { id: "rnotif-1", title: "Breaking: Digital Governance Bill clears Parliament", body: "A story you follow just published a major update", createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(), read: false },
  { id: "rnotif-2", title: "Your comment got a reply", body: "Someone replied to your comment on \"RBI Holds Repo Rate Steady\"", createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(), read: false },
  { id: "rnotif-3", title: "Weekly digest is ready", body: "Your personalized weekly reading digest has arrived", createdAt: new Date(Date.now() - 26 * 3600 * 1000).toISOString(), read: true },
];

export interface AdminBackup {
  id: string;
  createdAt: string;
  sizeMb: number;
  type: "manual" | "automatic";
}

export const adminBackups: AdminBackup[] = [
  { id: "b-1", createdAt: "2026-08-01T02:00:00.000Z", sizeMb: 412, type: "automatic" },
  { id: "b-2", createdAt: "2026-07-31T02:00:00.000Z", sizeMb: 409, type: "automatic" },
  { id: "b-3", createdAt: "2026-07-29T14:32:00.000Z", sizeMb: 405, type: "manual" },
  { id: "b-4", createdAt: "2026-07-30T02:00:00.000Z", sizeMb: 408, type: "automatic" },
];

export interface AuditLogEntry {
  id: string;
  action: string;
  actor: string;
  entity: string;
  createdAt: string;
}

export const auditLogEntries: AuditLogEntry[] = [
  { id: "log-1", action: "post.publish", actor: "Arjun Kapoor", entity: "Parliament Clears Digital Governance Bill…", createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString() },
  { id: "log-2", action: "comment.mark_spam", actor: "Meera Nair", entity: "Comment by guest_2291", createdAt: new Date(Date.now() - 55 * 60 * 1000).toISOString() },
  { id: "log-3", action: "user.role_change", actor: "Alok", entity: "Sana Iyer → Journalist", createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString() },
  { id: "log-4", action: "category.create", actor: "Arjun Kapoor", entity: "Explainers", createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString() },
  { id: "log-5", action: "auth.login", actor: "Rohit Verma", entity: "Session started", createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString() },
  { id: "log-6", action: "ad.pause", actor: "Alok", entity: "Airline Monsoon Fares", createdAt: new Date(Date.now() - 26 * 3600 * 1000).toISOString() },
  { id: "log-7", action: "post.schedule", actor: "Meera Nair", entity: "Heat Advisory Issued for Northern Plains…", createdAt: new Date(Date.now() - 30 * 3600 * 1000).toISOString() },
];

export interface EpaperPage {
  pageNumber: number;
  thumbnailUrl: string;
}

export interface EpaperEdition {
  date: string;
  pages: EpaperPage[];
}

const EPAPER_PAGE_IMAGES = [
  "1495020689067-958852a7765e",
  "1504711434969-e33886168f5c",
  "1585829365295-ab7cd400c167",
  "1503694978374-8a2fa686963a",
  "1516321318423-f06f85e504b3",
  "1518281420975-50db6e5d0a97",
];

export function getEpaperEdition(date: string): EpaperEdition {
  return {
    date,
    pages: EPAPER_PAGE_IMAGES.map((seed, i) => ({
      pageNumber: i + 1,
      thumbnailUrl: `https://images.unsplash.com/photo-${seed}?w=500&h=700&fit=crop`,
    })),
  };
}

export interface LiveChannel {
  id: string;
  name: string;
  description: string;
  posterUrl: string;
}

export const liveChannels: LiveChannel[] = [
  {
    id: "azeel-news-hd",
    name: "AZEEL News HD",
    description: "24x7 national and world news coverage.",
    posterUrl: "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&h=450&fit=crop",
  },
  {
    id: "azeel-business",
    name: "AZEEL Business",
    description: "Markets, earnings, and economic policy.",
    posterUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=450&fit=crop",
  },
  {
    id: "azeel-sports",
    name: "AZEEL Sports",
    description: "Live scores, analysis, and match coverage.",
    posterUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&h=450&fit=crop",
  },
];

export interface LiveScheduleItem {
  id: string;
  time: string;
  show: string;
  host: string;
}

export const liveSchedule: LiveScheduleItem[] = [
  { id: "sch-1", time: "07:00", show: "Morning Briefing", host: "Meera Nair" },
  { id: "sch-2", time: "09:00", show: "Market Open", host: "Sana Iyer" },
  { id: "sch-3", time: "13:00", show: "Midday Update", host: "Arjun Kapoor" },
  { id: "sch-4", time: "18:00", show: "Prime Time News", host: "Rohit Verma" },
  { id: "sch-5", time: "21:00", show: "The Big Debate", host: "Arjun Kapoor" },
];

export interface AdminComment extends Comment {
  articleHeadline: string;
  articleSlug: string;
}

export function getAllComments(): AdminComment[] {
  const articles = getAllArticles();
  return Object.values(mockComments)
    .flat()
    .map((comment) => {
      const article = articles.find((a) => a.id === comment.articleId);
      return {
        ...comment,
        articleHeadline: article?.headline ?? "Unknown article",
        articleSlug: article?.slug ?? "",
      };
    })
    .sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
}

export const mockComments: Record<string, Comment[]> = {
  "a-1001": [
    {
      id: "c-1",
      articleId: "a-1001",
      authorName: "Priya S.",
      postedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      text: "Good that the compliance window was extended — smaller platforms genuinely needed the runway.",
      likes: 14,
      status: "approved",
    },
    {
      id: "c-2",
      articleId: "a-1001",
      authorName: "Karan M.",
      postedAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
      text: "Would like to see the cross-border transfer rules published sooner rather than later.",
      likes: 6,
      status: "approved",
    },
    {
      id: "c-3",
      articleId: "a-1001",
      authorName: "guest_2291",
      postedAt: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
      text: "First!! check out my page for FREE crypto giveaways link in bio",
      likes: 0,
      status: "spam",
    },
  ],
  "a-1002": [
    {
      id: "c-4",
      articleId: "a-1002",
      authorName: "Nikhil R.",
      postedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
      text: "Surprised the dissent came from an external member rather than an RBI staffer — worth watching next quarter.",
      likes: 9,
      status: "approved",
    },
    {
      id: "c-5",
      articleId: "a-1002",
      authorName: "Ananya D.",
      postedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
      text: "Would help to see the dissenting member's reasoning published in full.",
      likes: 3,
      status: "pending",
    },
  ],
  "a-2001": [
    {
      id: "c-6",
      articleId: "a-2001",
      authorName: "Vikram S.",
      postedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      text: "Good to see uncapped players getting a look — squad depth has been thin for a while.",
      likes: 21,
      status: "pending",
    },
  ],
};

