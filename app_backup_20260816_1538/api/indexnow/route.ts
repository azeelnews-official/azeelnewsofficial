import { NextResponse } from "next/server";

export async function GET(){

return NextResponse.json({
success:true,
message:"IndexNow Ready",
key:process.env.INDEXNOW_KEY
});

}
