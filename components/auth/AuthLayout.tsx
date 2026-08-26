import Link from "next/link";

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between bg-ink-950 p-10 text-white lg:flex">
        <Link href="/" className="w-fit">
          <span className="font-display text-3xl font-black tracking-masthead text-white">
            AZEEL <span className="text-press">NEWS</span>
          </span>
        </Link>

        <blockquote className="max-w-md">
          <p className="font-display text-3xl font-medium italic leading-snug text-ink-100">
            &ldquo;Reported. Verified. Delivered.&rdquo;
          </p>
          <p className="mt-4 text-sm text-ink-300">
            Sign in to save stories, follow topics, and get a feed built around what you read.
          </p>
        </blockquote>

        <p className="font-mono text-[11px] tracking-eyebrow text-ink-300">
          © {new Date().getFullYear()} AZEEL NEWS — A product of Azeel Technologies
        </p>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-8 block w-fit lg:hidden">
            <span className="font-display text-2xl font-black tracking-masthead text-ink-950 dark:text-white">
              AZEEL <span className="text-press">NEWS</span>
            </span>
          </Link>

          <h1 className="mb-1.5 font-display text-2xl font-bold text-ink-950 dark:text-white">{title}</h1>
          <p className="mb-7 text-sm text-ink-300 dark:text-ink-100">{subtitle}</p>

          {children}
        </div>
      </div>
    </div>
  );
}
