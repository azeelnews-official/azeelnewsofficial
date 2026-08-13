"use client";

import { useRef, useState } from "react";
import { Calendar, ImagePlus, Tag as TagIcon, X } from "lucide-react";
import { categories } from "@/lib/data/constants";
import type { CategorySlug } from "@/lib/types";
import type { PostStatus } from "@/lib/data/constants";
import { cn } from "@/lib/utils";

export function PublishPanel({
  status,
  onStatusChange,
  scheduledAt,
  onScheduledAtChange,
  saving,
  lastSavedLabel,
  onSaveDraft,
  onPublish,
}: {
  status: PostStatus;
  onStatusChange: (s: PostStatus) => void;
  scheduledAt: string;
  onScheduledAtChange: (v: string) => void;
  saving: boolean;
  lastSavedLabel: string;
  onSaveDraft: () => void;
  onPublish: () => void;
}) {
  return (
    <div className="border border-hairline bg-surface p-4">
      <h3 className="mb-3 font-display text-sm font-bold text-ink-950">Publish</h3>

      <label htmlFor="post-status" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-300">
        Status
      </label>
      <select
        id="post-status"
        value={status}
        onChange={(e) => onStatusChange(e.target.value as PostStatus)}
        className="mb-3 w-full rounded-md border border-hairline px-2.5 py-2 text-sm text-ink-900 outline-none focus:border-azeel"
      >
        <option value="draft">Draft</option>
        <option value="published">Published</option>
        <option value="scheduled">Scheduled</option>
      </select>

      {status === "scheduled" && (
        <div className="mb-3">
          <label htmlFor="post-schedule" className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-300">
            <Calendar size={12} /> Publish at
          </label>
          <input
            id="post-schedule"
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => onScheduledAtChange(e.target.value)}
            className="w-full rounded-md border border-hairline px-2.5 py-2 text-sm text-ink-900 outline-none focus:border-azeel"
          />
        </div>
      )}

      <p className="mb-3 font-mono text-[11px] text-ink-300">
        {saving ? "Saving…" : lastSavedLabel}
      </p>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onSaveDraft}
          className="flex-1 rounded-md border border-hairline px-3 py-2 text-sm font-semibold text-ink-800 hover:bg-ink-50"
        >
          Save Draft
        </button>
        <button
          type="button"
          onClick={onPublish}
          className="flex-1 rounded-md bg-azeel px-3 py-2 text-sm font-semibold text-white hover:bg-azeel-dark"
        >
          {status === "scheduled" ? "Schedule" : "Publish"}
        </button>
      </div>
    </div>
  );
}

export function FeaturedImagePanel({
  imageUrl,
  onImageChange,
}: {
  imageUrl: string;
  onImageChange: (url: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        onImageChange(data.url);
        return;
      }
    } catch {
      // fall through to local preview below
    }
    // Cloudinary isn't configured in this environment (or the request
    // failed) — fall back to a local object-URL preview so the editor
    // stays usable without upload credentials set up.
    onImageChange(URL.createObjectURL(file));
  }

  return (
    <div className="border border-hairline bg-surface p-4">
      <h3 className="mb-3 font-display text-sm font-bold text-ink-950">Featured Image</h3>
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- arbitrary uploaded/pasted URLs, next/image domains aren't known ahead of time
        <img src={imageUrl} alt="Featured" className="mb-3 aspect-video w-full rounded object-cover" />
      ) : (
        <div className="mb-3 flex aspect-video w-full items-center justify-center rounded border border-dashed border-hairline text-ink-300">
          <ImagePlus size={22} />
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="mb-2 w-full rounded-md border border-hairline px-3 py-2 text-sm font-semibold text-ink-800 hover:bg-ink-50"
      >
        Upload Image
      </button>
      <input
        type="url"
        value={imageUrl}
        onChange={(e) => onImageChange(e.target.value)}
        placeholder="or paste an image URL"
        className="w-full rounded-md border border-hairline px-2.5 py-2 text-xs text-ink-900 outline-none placeholder:text-ink-300 focus:border-azeel"
      />
    </div>
  );
}

export function TaxonomyPanel({
  category,
  onCategoryChange,
  tags,
  onTagsChange,
}: {
  category: CategorySlug;
  onCategoryChange: (c: CategorySlug) => void;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}) {
  const [tagDraft, setTagDraft] = useState("");

  function addTag() {
    const trimmed = tagDraft.trim();
    if (trimmed && !tags.includes(trimmed)) onTagsChange([...tags, trimmed]);
    setTagDraft("");
  }

  return (
    <div className="border border-hairline bg-surface p-4">
      <h3 className="mb-3 font-display text-sm font-bold text-ink-950">Organize</h3>

      <label htmlFor="post-category" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-300">
        Category
      </label>
      <select
        id="post-category"
        value={category}
        onChange={(e) => onCategoryChange(e.target.value as CategorySlug)}
        className="mb-3 w-full rounded-md border border-hairline px-2.5 py-2 text-sm text-ink-900 outline-none focus:border-azeel"
      >
        {categories.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.label}
          </option>
        ))}
      </select>

      <label htmlFor="post-tags" className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-300">
        <TagIcon size={12} /> Tags
      </label>
      <div className="mb-2 flex gap-2">
        <input
          id="post-tags"
          type="text"
          value={tagDraft}
          onChange={(e) => setTagDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
          placeholder="Add a tag and press Enter"
          className="w-full rounded-md border border-hairline px-2.5 py-2 text-sm text-ink-900 outline-none placeholder:text-ink-300 focus:border-azeel"
        />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className={cn(
              "inline-flex items-center gap-1 rounded-full border border-hairline px-2.5 py-0.5 text-xs font-medium text-ink-600"
            )}
          >
            {tag}
            <button
              type="button"
              onClick={() => onTagsChange(tags.filter((t) => t !== tag))}
              aria-label={`Remove tag ${tag}`}
              className="text-ink-300 hover:text-press"
            >
              <X size={11} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

export function SeoPanel({
  metaDescription,
  onMetaDescriptionChange,
  slug,
  onSlugChange,
}: {
  metaDescription: string;
  onMetaDescriptionChange: (v: string) => void;
  slug: string;
  onSlugChange: (v: string) => void;
}) {
  return (
    <div className="border border-hairline bg-surface p-4">
      <h3 className="mb-3 font-display text-sm font-bold text-ink-950">SEO</h3>

      <label htmlFor="post-slug" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-300">
        URL Slug
      </label>
      <input
        id="post-slug"
        type="text"
        value={slug}
        onChange={(e) => onSlugChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-"))}
        className="mb-3 w-full rounded-md border border-hairline px-2.5 py-2 font-mono text-xs text-ink-900 outline-none focus:border-azeel"
      />

      <label htmlFor="post-meta-desc" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-300">
        Meta Description
      </label>
      <textarea
        id="post-meta-desc"
        value={metaDescription}
        onChange={(e) => onMetaDescriptionChange(e.target.value.slice(0, 160))}
        rows={3}
        className="w-full resize-none rounded-md border border-hairline px-2.5 py-2 text-sm text-ink-900 outline-none focus:border-azeel"
      />
      <p className="mt-1 text-right font-mono text-[10px] text-ink-300">{metaDescription.length}/160</p>
    </div>
  );
}
