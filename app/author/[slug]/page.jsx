export default async function AuthorPage({ params }) {

  const { slug } = await params;

  return (
    <main className="container mx-auto py-10 px-5">

      <h1 className="text-4xl font-bold capitalize">
        {slug.replace("-", " ")}
      </h1>

      <p className="mt-4 text-gray-600">
        Latest articles published by this author.
      </p>

    </main>
  );
}
