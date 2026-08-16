"use client"

import Link from "next/link"

export default function LanguageSwitcher(){

return(
<div className="flex gap-3">

<Link href="/en">
English
</Link>

<Link href="/hi">
हिंदी
</Link>

</div>
)

}
