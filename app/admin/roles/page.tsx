import { ROLE_PERMISSIONS, getRoleStats } from "@/lib/data/roles";

export const metadata = {
title:"Roles"
};


export default async function RolesPage(){

const stats = await getRoleStats();


return (

<div className="p-6">

<h1 className="text-3xl font-bold mb-6">
Admin Roles
</h1>


<div className="grid gap-6 md:grid-cols-2">

{
Object.entries(ROLE_PERMISSIONS).map(([role,info])=>{

const count =
stats.find(
(item)=>item.role===role
)?._count.role ?? 0;


return (

<div
key={role}
className="rounded-xl border p-5"
>

<h2 className="text-xl font-bold">
{info.label}
</h2>


<p className="text-sm text-gray-500">
{info.description}
</p>


<p className="mt-3 font-semibold">
Users: {count}
</p>


<ul className="mt-3 list-disc pl-5">

{
info.permissions.map(permission=>(
<li key={permission}>
{permission}
</li>
))
}

</ul>


</div>

)

})

}

</div>


</div>

)

}
