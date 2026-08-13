
import { NextResponse } from "next/server";
import { searchArticles } from "@/lib/data/search";

export async function GET(req:Request){

const {searchParams}=new URL(req.url);

const q=searchParams.get("q") || "";

const results=await searchArticles(q);

return NextResponse.json(results);

}
