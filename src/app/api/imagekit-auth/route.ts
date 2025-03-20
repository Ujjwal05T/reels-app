import ImageKit from "imagekit"
import { NextResponse } from "next/server";

const imagekit = new ImageKit({
  publicKey: process.env.PUBLIC_KEY!,
  privateKey: process.env.PRIVATE_KEY!,
  urlEndpoint: process.env.URL_ENDPOINT!,
});

export async function GET() {
   try {
      const response = imagekit.getAuthenticationParameters()
      return NextResponse.json(response);
   } catch (error) {
      return NextResponse.json({error: "Imagekit Auth failed"}, {status: 500});
   }
}