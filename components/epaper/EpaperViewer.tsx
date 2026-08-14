"use client";

import {useEffect,useState} from "react";
import {Download,Calendar} from "lucide-react";


function today(){

return new Date()
.toISOString()
.slice(0,10);

}



export function EpaperViewer(){

const [date,setDate]=useState(today());

const [edition,setEdition]=useState<any>(null);


useEffect(()=>{


fetch(`/api/epaper?date=${date}`)
.then(res=>res.json())
.then(data=>setEdition(data));


},[date]);



return (

<div>

<div className="mb-6 flex justify-between">

<h1 className="text-3xl font-bold">
E-Paper
</h1>


<div className="flex gap-3">

<Calendar/>

<input
type="date"
value={date}
onChange={(e)=>setDate(e.target.value)}
/>


</div>

</div>



{
edition ? (

<div>

<a
href={edition.pdfUrl}
target="_blank"
className="flex items-center gap-2 bg-azeel text-white px-4 py-2 rounded"
>

<Download size={16}/>
Download PDF

</a>


</div>


)

:

(

<p>
No E-paper available for this date.
</p>

)

}



</div>

);

}
