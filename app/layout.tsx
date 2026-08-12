import type { Metadata, Viewport } from "next";
import "./globals.css";

import { AuthProvider } from "@/components/auth/AuthProvider";
import { LanguageProvider } from "@/components/i18n/LanguageProvider";


const SITE_URL = "https://www.azeelnews.in";
const SITE_NAME = "AZEEL NEWS";

const SITE_DESCRIPTION =
"AZEEL NEWS delivers fast, verified reporting on India and world affairs — politics, business, technology, sports and more, in English and Hindi.";


export const metadata: Metadata = {

metadataBase:new URL(SITE_URL),

title:{
default:`${SITE_NAME} — Breaking News, India & World`,
template:`%s | ${SITE_NAME}`,
},

description:SITE_DESCRIPTION,

applicationName:SITE_NAME,


robots:{
index:true,
follow:true,
googleBot:{
index:true,
follow:true,
"max-image-preview":"large",
}
},


icons:{
icon:"/favicon.ico",
apple:"/apple-touch-icon.png",
},


manifest:"/site.webmanifest",

openGraph:{
type:"website",
siteName:SITE_NAME,
title:`${SITE_NAME} — Breaking News, India & World`,
description:SITE_DESCRIPTION,
url:SITE_URL,
images:[
{
url:"/og/home.jpg",
width:1200,
height:630,
alt:SITE_NAME,
}
]
},


twitter:{
card:"summary_large_image",
title:SITE_NAME,
images:["/og/home.jpg"],
}

};



export const viewport:Viewport={

width:"device-width",

initialScale:1,

themeColor:"#0B1220"

};



const organizationSchema={

"@context":"https://schema.org",

"@type":"NewsMediaOrganization",

name:SITE_NAME,

url:SITE_URL,

logo:`${SITE_URL}/logo.png`

};



export default function RootLayout({

children,

}:Readonly<{

children:React.ReactNode

}>) {


return (

<html lang="en-IN">


<head>

<script

type="application/ld+json"

dangerouslySetInnerHTML={{

__html:JSON.stringify(organizationSchema)

}}

/>

</head>



<body>


<a href="#main-content" className="skip-link">

Skip to main content

</a>



<AuthProvider>

<LanguageProvider>

{children}

</LanguageProvider>

</AuthProvider>



</body>


</html>

);

}
