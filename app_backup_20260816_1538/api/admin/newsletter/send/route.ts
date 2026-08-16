import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { sendNewsletterEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {

  const session = await getCurrentSession();

  if (!session || !["EDITOR", "ADMIN"].includes(session.role)) {
    return NextResponse.json(
      { error: "Not authorized." },
      { status: 403 }
    );
  }


  const { subject, body } = await req.json();


  if (!subject?.trim() || !body?.trim()) {
    return NextResponse.json(
      { error: "Subject and body are required." },
      { status: 400 }
    );
  }


  const activeSubscribers = await prisma.newsletterSubscriber.findMany({
    where:{
      active:true
    }
  });


  const bodyHtml = body
    .split("\n")
    .map((line:string)=>`<p>${line}</p>`)
    .join("");


  await Promise.all(
    activeSubscribers.map((subscriber)=>
      sendNewsletterEmail(
        subscriber.email,
        subject,
        bodyHtml
      )
    )
  );


  return NextResponse.json({
    ok:true,
    sentTo:activeSubscribers.length
  });

}
