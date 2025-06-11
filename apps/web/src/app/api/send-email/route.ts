import { NextRequest, NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: NextRequest) {
  const form = await req.formData();

  const to = form.get("to")!.toString();
  const subject = form.get("subject")!.toString();
  const text = form.get("body")!.toString();

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
      const originalName = val.name;
      const match = originalName.match(/resume-\d+T\d+Z-(.+)\.pdf$/i);
      const company = match ? match[1].toUpperCase() : "";
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

  try {
    await sgMail.send({
      from: process.env.EMAIL_SENDER!,
      to,
      subject,
      text,
      attachments,
    });
    return NextResponse.json({ message: "Email sent successfully" });
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err) {
      const error = err as { code?: unknown; response?: { body?: unknown } };
      console.error("SendGrid error code:", error.code, error.response?.body);
    } else {
      console.error("Unknown error occurred while sending email:", err);
    }

    return NextResponse.json({ error: "Send failed" }, { status: 500 });
  }
}
