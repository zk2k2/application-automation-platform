// app/api/send-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: NextRequest) {
  const form = await req.formData();

  // 1) Pull basic fields
  const to = form.get("to")!.toString();
  const subject = form.get("subject")!.toString();
  const text = form.get("body")!.toString();

  // 2) Collect *all* File entries whose key starts with "attachments"
  const attachments: Array<{
    content: string;
    filename: string;
    type: string;
    disposition: string;
  }> = [];

  const firstName = process.env.APPLICANT_FIRSTNAME || "";
  const lastName = process.env.APPLICANT_LASTNAME || "";

  for (const [key, val] of form.entries()) {
    if (key.startsWith("attachments") && val instanceof File) {
      const buf = Buffer.from(await val.arrayBuffer());
      // original filename, e.g. resume-20250610T165845Z-amazon.pdf
      const originalName = val.name;
      // extract company from originalName
      const match = originalName.match(/resume-\d+T\d+Z-(.+)\.pdf$/i);
      const company = match ? match[1].toUpperCase() : "";
      // build new filename
      const newFilename =
        [firstName.toUpperCase(), lastName.toUpperCase(), "RESUME", company]
          .filter(Boolean)
          .join("_") + ".pdf";

      attachments.push({
        content: buf.toString("base64"),
        filename: newFilename,
        type: val.type || "application/pdf",
        disposition: "attachment",
      });
    }
  }

  // 3) Send via SendGrid
  try {
    await sgMail.send({
      from: process.env.EMAIL_SENDER!,
      to,
      subject,
      text,
      attachments,
    });
    return NextResponse.json({ message: "Email sent successfully" });
  } catch (err: any) {
    console.error("SendGrid error code:", err.code, err.response?.body);
    return NextResponse.json({ error: "Send failed" }, { status: 500 });
  }
}
