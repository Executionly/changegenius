import { sendContactUsEmail } from "@/lib/email";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2).max(80),
  email: z.email(),
  organization: z.string().max(100).optional(),
  message: z.string(),
  inquiryType: z.string(),
});

export async function POST(req: NextRequest) {

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { name, email, message, inquiryType, organization } = parsed.data;

  try {
    await sendContactUsEmail({
        name,
        email,
        message,
        inquiryType,
        organization
    })
  } catch (error) {
    throw new Error("Error, try again!")
  }

  return NextResponse.json({
    sent: true
  });
}
