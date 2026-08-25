import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

import { AuthProvider } from "@/components/auth/AuthProvider";
import { LanguageProvider } from "@/components/i18n/LanguageProvider";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";


import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { PWAInstallPrompt } from "@/components/pwa/PWAInstallPrompt";
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



const organizationSchema = [
{
"@context":"https://schema.org",
"@type":"NewsMediaOrganization",
"name":SITE_NAME,
"url":SITE_URL,

"logo":{
"@type":"ImageObject",
"url":`${SITE_URL}/logo.png`,
"width":512,
"height":512
},

"description":SITE_DESCRIPTION,

"foundingDate":"2025",

"contactPoint":{
"@type":"ContactPoint",
"contactType":"customer support",
"url":`${SITE_URL}/contact`,
"availableLanguage":[
"English",
"Hindi"
]
},

"publishingPrinciples":`${SITE_URL}/editorial-policy`,

"sameAs":[
"https://www.instagram.com/azeelnews",
"https://www.linkedin.com/company/azeelnews",
"https://www.youtube.com/@azeelnews",
"https://x.com/azeelnews"
]
},
{
"@context":"https://schema.org",
"@type":"WebSite",
"name":SITE_NAME,
"url":SITE_URL,
"description":SITE_DESCRIPTION,
"potentialAction":{
"@type":"SearchAction",
"target":{
"@type":"EntryPoint",
"urlTemplate":`${SITE_URL}/search?q={search_term_string}`
},
"query-input":"required name=search_term_string"
}
}
]



export default function RootLayout({

children,

}:Readonly<{

children:React.ReactNode

}>) {


return (

<html suppressHydrationWarning lang="en-IN">


<head>

<script
  type="application/ld+json"
  suppressHydrationWarning
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(organizationSchema),
  }}
/>


<script async type="application/javascript"
src="https://news.google.com/swg/js/v1/swg-basic.js"></script>

<script
dangerouslySetInnerHTML={{
__html: `
(self.SWG_BASIC = self.SWG_BASIC || []).push( basicSubscriptions => {
basicSubscriptions.init({
type: "NewsArticle",
isPartOfType: ["Product"],
isPartOfProductId: "CAowxcXHDA:openaccess",
clientOptions: { theme: "light", lang: "en" },
});
});
`
}}
/>

</head>



<body>


<a href="#main-content" className="skip-link">

Skip to main content

</a>



<GoogleAnalytics />

<AuthProvider>

<LanguageProvider>

{children}
      <PWAInstallPrompt />

</LanguageProvider>

</AuthProvider>



<Analytics />

</body>


</html>

);

}
