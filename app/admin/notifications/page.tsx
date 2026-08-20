
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/session";

export const dynamic="force-dynamic";

export default async function NotificationsAdmin(){

const session=await getCurrentSession();

if(
!session ||
session.role!=="ADMIN"
){
redirect("/login");
}


const notifications =
await prisma.notification.findMany({
orderBy:{
createdAt:"desc"
}
});


return (

<div className="p-8">

<h1 className="text-3xl font-bold mb-6">
Notification Manager
</h1>


<form
action="/api/admin/notifications"
method="post"
className="space-y-4"
>

<input
name="title"
placeholder="English Title"
className="border p-3 w-full"
/>


<input
name="titleHi"
placeholder="Hindi Title"
className="border p-3 w-full"
/>


<textarea
name="body"
placeholder="English Message"
className="border p-3 w-full"
/>


<textarea
name="bodyHi"
placeholder="Hindi Message"
className="border p-3 w-full"
/>


<button className="bg-black text-white px-6 py-3 rounded">
Publish Notification
</button>


</form>


<div className="mt-10">

{
notifications.map(n=>(

<div
key={n.id}
className="border p-4 mb-3"
>

<b>{n.title}</b>

<p>{n.body}</p>

</div>

))
}

</div>


</div>

)

}
