export default async function AuthorPage({ params }) {

const { slug } = await params;

const authorName = slug
.replaceAll("-", " ")
.replace(/\b\w/g, (c) => c.toUpperCase());


return (

<main>

<section className="bg-gray-100 py-14">

<div className="max-w-6xl mx-auto px-5">


<div className="bg-white rounded-2xl shadow p-8 flex items-center gap-6">


<div className="w-24 h-24 rounded-full bg-blue-700 text-white flex items-center justify-center text-4xl font-bold">
A
</div>


<div>

<h1 className="text-4xl font-bold">
{authorName}
</h1>


<p className="mt-3 text-gray-600">
Editor & Author at Azeel News. Reporting verified news, technology, business and current affairs.
</p>


<div className="flex gap-5 mt-4 text-blue-600">

<a href="#">
LinkedIn
</a>

<a href="#">
Instagram
</a>

<a href="#">
X
</a>

</div>


</div>


</div>


</div>

</section>



<section className="max-w-6xl mx-auto px-5 py-12">


<h2 className="text-3xl font-bold mb-6">
Latest Articles
</h2>


<div className="grid md:grid-cols-3 gap-6">


<div className="border rounded-xl p-6">

<h3 className="font-bold text-xl">
No articles available
</h3>

<p className="text-gray-600 mt-3">
Latest articles by this author will appear here.
</p>

</div>


</div>


</section>



<section className="bg-blue-900 text-white py-12">


<div className="max-w-6xl mx-auto px-5 text-center">


<h2 className="text-3xl font-bold">
Stay Updated With Azeel News
</h2>


<p className="mt-3">
Get breaking news, technology updates and important stories directly in your inbox.
</p>


<button className="mt-6 bg-white text-blue-900 px-6 py-3 rounded-lg font-bold">
Subscribe
</button>


</div>


</section>


</main>

)

}
