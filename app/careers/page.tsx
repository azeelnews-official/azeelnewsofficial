import type { Metadata } from "next";
import { Briefcase, MapPin } from "lucide-react";
import { StaticPageLayout } from "@/components/pages/StaticPageLayout";

export const metadata: Metadata = { title: "Careers", alternates: { canonical: "/careers" } };

const OPEN_ROLES = [
  { title: "Staff Correspondent — Politics", location: "New Delhi", type: "Full-time" },
  { title: "Business Desk Reporter", location: "Mumbai", type: "Full-time" },
  { title: "Video Producer", location: "Bengaluru", type: "Full-time" },
  { title: "Frontend Engineer (Next.js)", location: "Remote (India)", type: "Full-time" },
];

export default function CareersPage() {
  return (
    <StaticPageLayout title="Careers at AZEEL NEWS">
      <p>
        We&rsquo;re building one of India&rsquo;s fastest-growing digital newsrooms. If you care
        about accurate, fast, well-told stories, we&rsquo;d like to hear from you.
      </p>

      <h2 className="mt-4 font-display text-lg font-bold text-ink-900">Open Roles</h2>
      <div className="flex flex-col gap-3">
        {OPEN_ROLES.map((role) => (
          <div key={role.title} className="flex items-center justify-between border border-hairline bg-surface p-4">
            <div>
              <p className="font-semibold text-ink-900">{role.title}</p>
              <p className="flex items-center gap-1.5 text-sm text-ink-300">
                <MapPin size={13} /> {role.location} · {role.type}
              </p>
            </div>
            <a
              href="mailto:careers@azeelnews.in?subject=Application"
              className="flex items-center gap-1.5 rounded-md bg-azeel px-3 py-1.5 text-xs font-semibold text-white hover:bg-azeel-dark"
            >
              <Briefcase size={13} /> Apply
            </a>
          </div>
        ))}
      </div>

      <p className="mt-2">
        Don&rsquo;t see a fit? Send your resume to{" "}
        <a href="mailto:careers@azeelnews.in" className="text-azeel hover:text-azeel-dark">careers@azeelnews.in</a>{" "}
        anyway — we&rsquo;re always looking for good people.
      </p>
    </StaticPageLayout>
  );
}
