export default function Loading() {
  return (
    <main className="mx-auto max-w-[1400px] px-4 py-8 animate-pulse">

      <div className="mb-5 h-3 w-40 rounded bg-gray-200" />

      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">

        <article>

          <div className="mb-3 h-6 w-28 rounded bg-gray-200" />

          <div className="mb-4 space-y-3">
            <div className="h-10 w-full rounded bg-gray-200" />
            <div className="h-10 w-4/5 rounded bg-gray-200" />
          </div>

          <div className="mb-5 h-5 w-3/4 rounded bg-gray-200" />

          <div className="mb-6 border-b pb-6">
            <div className="h-12 w-64 rounded bg-gray-200" />
          </div>

          <div className="mb-8 aspect-video rounded bg-gray-200" />

          <div className="space-y-3">
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-5/6 rounded bg-gray-200" />
          </div>

        </article>


        <aside className="hidden lg:block">

          <div className="h-72 rounded bg-gray-200" />

        </aside>

      </div>

    </main>
  );
}
