"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, PenLine } from "lucide-react";
import { EditorToolbar } from "./EditorToolbar";
import { MarkdownPreview } from "./MarkdownPreview";
import {
  PublishPanel,
  FeaturedImagePanel,
  TaxonomyPanel,
  SeoPanel,
} from "./EditorPanels";
import type { CategorySlug } from "@/lib/types";
import type { PostStatus } from "@/lib/types/post";
import { cn } from "@/lib/utils";

export interface PostEditorInitialValues {
  id?: string;
  title?: string;
  slug?: string;
  category?: CategorySlug;
  tags?: string[];
  featuredImageUrl?: string;
  body?: string;
  bodyHi?: string;
  headlineHi?: string;
  metaDescription?: string;
  status?: PostStatus;
  scheduledAt?: string;
  location?: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function PostEditorForm({
  initialValues = {},
  mode,
}: {
  initialValues?: PostEditorInitialValues;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [postId] = useState(initialValues.id ?? null);

  const [title, setTitle] = useState(
    initialValues.title ?? ""
  );

  const [headlineHi, setHeadlineHi] = useState(
    initialValues.headlineHi ?? ""
  );

  const [slugOverride, setSlugOverride] =
    useState<string | null>(
      mode === "edit"
        ? initialValues.slug ?? null
        : null
    );

  const slug =
    slugOverride ?? slugify(title);

  const [category, setCategory] =
    useState<CategorySlug>(
      initialValues.category ?? "india"
    );

  const [tags, setTags] = useState<string[]>(
    initialValues.tags ?? []
  );

  const [location, setLocation] =
    useState(initialValues.location ?? "");

  const [featuredImageUrl, setFeaturedImageUrl] =
    useState(
      initialValues.featuredImageUrl ?? ""
    );

  const [body, setBody] = useState(
    initialValues.body ?? ""
  );

  const [bodyHi, setBodyHi] = useState(
    initialValues.bodyHi ?? ""
  );

  const [metaDescription, setMetaDescription] =
    useState(
      initialValues.metaDescription ?? ""
    );

  const [status, setStatus] =
    useState<PostStatus>(
      initialValues.status ?? "DRAFT"
    );

  const [scheduledAt, setScheduledAt] =
    useState(
      initialValues.scheduledAt ?? ""
    );

  const [activeTab, setActiveTab] =
    useState<"write" | "preview">("write");

  const [saving, setSaving] =
    useState(false);

  const [lastSavedAt, setLastSavedAt] =
    useState<Date | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  async function savePost(
    requestedStatus: PostStatus
  ) {
    setError(null);
    setSaving(true);

    try {
      if (!title.trim()) {
        throw new Error(
          "Headline is required."
        );
      }

      if (!body.trim()) {
        throw new Error(
          "Article body is required."
        );
      }

      if (!featuredImageUrl.trim()) {
        throw new Error(
          "Please upload a featured image."
        );
      }

      if (
        requestedStatus === "SCHEDULED" &&
        !scheduledAt
      ) {
        throw new Error(
          "Please select a publish date and time."
        );
      }

      const payload = {
        headline: title.trim(),
        headlineHi: headlineHi.trim(),
        slug: slug.trim(),
        dek:
          metaDescription.trim() ||
          title.trim(),
        body: body.trim(),
        bodyHi: bodyHi.trim(),
        category,
        tags,
        featuredImageUrl:
          featuredImageUrl.trim(),
        featuredImageAlt:
          title.trim(),
        metaDescription:
          metaDescription.trim() || null,
        status: requestedStatus,
        scheduledAt:
          requestedStatus === "SCHEDULED"
            ? scheduledAt
            : null,
        location:
          location.trim() || null,
      };

      const endpoint =
        mode === "edit" && postId
          ? `/api/admin/posts/${postId}`
          : "/api/admin/posts";

      const method =
        mode === "edit" && postId
          ? "PATCH"
          : "POST";

      const response = await fetch(
        endpoint,
        {
          method,
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result =
        await response.json().catch(
          () => ({})
        );

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Unable to save the article."
        );
      }

      setStatus(requestedStatus);
      setLastSavedAt(new Date());

      router.push("/admin/posts");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong.";

      setError(message);
    } finally {
      setSaving(false);
    }
  }

  function handleSaveDraft() {
    void savePost("DRAFT");
  }

  function handlePublish() {
    if (status === "SCHEDULED") {
      void savePost("SCHEDULED");
      return;
    }

    void savePost("PUBLISHED");
  }

  const lastSavedLabel = lastSavedAt
    ? `Last saved ${lastSavedAt.toLocaleTimeString(
        "en-IN",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      )}`
    : "Not saved yet";

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink-950">
          {mode === "create"
            ? "New Post"
            : "Edit Post"}
        </h1>
      </div>

      {error && (
        <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            placeholder="Post headline"
            className="mb-3 w-full border-b-2 border-hairline bg-transparent pb-3 font-display text-2xl font-bold text-ink-950 outline-none placeholder:text-ink-300 focus:border-azeel"
          />

          <input
            type="text"
            value={headlineHi}
            onChange={(e) =>
              setHeadlineHi(e.target.value)
            }
            placeholder="Hindi headline (हिंदी शीर्षक)"
            className="mb-4 w-full border-b border-hairline bg-transparent pb-3 text-lg text-ink-900 outline-none placeholder:text-ink-300 focus:border-azeel"
          />

          <p className="mb-4 font-mono text-xs text-ink-300">
            /article/
            <input
              value={slug}
              onChange={(e) =>
                setSlugOverride(
                  slugify(e.target.value)
                )
              }
              className="border-b border-dashed border-hairline bg-transparent px-0.5 outline-none focus:border-azeel"
              style={{
                width: `${Math.max(
                  slug.length,
                  10
                )}ch`,
              }}
            />
          </p>

          <div className="mb-4">
            <label
              htmlFor="post-location"
              className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-300"
            >
              Dateline (optional)
            </label>

            <input
              id="post-location"
              value={location}
              onChange={(e) =>
                setLocation(
                  e.target.value.toUpperCase()
                )
              }
              placeholder="e.g. NEW DELHI"
              className="w-52 rounded-md border border-hairline px-3 py-1.5 text-sm text-ink-900 outline-none focus:border-azeel"
            />
          </div>

          <div className="border border-hairline bg-surface">
            <div className="flex border-b border-hairline">
              <TabButton
                active={
                  activeTab === "write"
                }
                onClick={() =>
                  setActiveTab("write")
                }
                icon={PenLine}
                label="Write"
              />

              <TabButton
                active={
                  activeTab === "preview"
                }
                onClick={() =>
                  setActiveTab("preview")
                }
                icon={Eye}
                label="Preview"
              />
            </div>

            {activeTab === "write" ? (
              <div>
                <EditorToolbar
                  textareaRef={textareaRef}
                  value={body}
                  onChange={setBody}
                />

                <textarea
                  ref={textareaRef}
                  value={body}
                  onChange={(e) =>
                    setBody(e.target.value)
                  }
                  placeholder="Write the story in Markdown… use the toolbar for formatting, images, and YouTube embeds."
                  rows={20}
                  className="w-full resize-y px-5 py-4 font-mono text-sm leading-relaxed text-ink-900 outline-none placeholder:text-ink-300"
                />

                <textarea
                  value={bodyHi}
                  onChange={(e) =>
                    setBodyHi(e.target.value)
                  }
                  placeholder="Write Hindi article..."
                  rows={20}
                  className="mt-4 w-full resize-y border-t border-hairline px-5 py-4 font-mono text-sm leading-relaxed text-ink-900 outline-none placeholder:text-ink-300"
                />
              </div>
            ) : (
              <MarkdownPreview
                markdown={body}
                title={title}
              />
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <PublishPanel
            status={status}
            onStatusChange={setStatus}
            scheduledAt={scheduledAt}
            onScheduledAtChange={
              setScheduledAt
            }
            saving={saving}
            lastSavedLabel={
              lastSavedLabel
            }
            onSaveDraft={
              handleSaveDraft
            }
            onPublish={handlePublish}
          />

          <FeaturedImagePanel
            imageUrl={
              featuredImageUrl
            }
            onImageChange={
              setFeaturedImageUrl
            }
          />

          <TaxonomyPanel
            category={category}
            onCategoryChange={
              setCategory
            }
            tags={tags}
            onTagsChange={setTags}
          />

          <SeoPanel
            metaDescription={
              metaDescription
            }
            onMetaDescriptionChange={
              setMetaDescription
            }
            slug={slug}
            onSlugChange={
              setSlugOverride
            }
          />
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{
    size?: number;
  }>;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors",
        active
          ? "border-azeel text-azeel-dark"
          : "border-transparent text-ink-300 hover:text-ink-800"
      )}
    >
      <Icon size={14} />
      {label}
    </button>
  );
}