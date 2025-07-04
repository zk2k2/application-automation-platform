"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Copy, Eye } from "lucide-react";

interface ResumeItem {
  s3_key: string;
  company: string;
  position: string;
  timestamp: string;
  short_url: string;
}

interface Attachment {
  filename: string;
  data: Blob;
}

export default function CareersPage() {
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const handleRemoveAll = () => {
    setAttachments([]);
    toast(`All attachments removed.`);
  };

  useEffect(() => {
    fetch("/api/fetch-resumes")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setResumes(data);
        } else if (data.items && Array.isArray(data.items)) {
          setResumes(data.items);
        } else {
          console.error("Unexpected resumes response:", data);
          toast.error("Invalid data received");
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load resumes");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCopy = (url: string) => {
    navigator.clipboard
      .writeText(url)
      .then(() => toast.success("Link copied"))
      .catch(() => toast.error("Copy failed"));
  };

  const handleAttach = async (item: ResumeItem) => {
    try {
      const res = await fetch(
        `/api/fetch-resume-pdf?s3_key=${encodeURIComponent(item.s3_key)}`
      );
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const filename = item.s3_key.split("/").pop() || "resume.pdf";

      setAttachments((prev) => [...prev, { filename, data: blob }]);

      setSubject(
        `[ Application for ${item.position} Role at ${item.company} ]`
      );
      setBody(`Dear Hiring Team,

I hope this e-mail finds you well.

I am reaching out to apply for the ${item.position} Role at ${item.company}.

I am very excited about this opportunity and believe my skills and experience make me an excellent fit.

You will find my resume attached to this e-mail.

Regards,
${process.env.NEXT_PUBLIC_SENDER_FIRSTNAME} ${process.env.NEXT_PUBLIC_SENDER_LASTNAME}`);

      toast.success(`Attached ${filename}`);
    } catch {
      toast.error("Failed to attach resume");
    }
  };

  const handleView = (url: string) => {
    window.open(url, "_blank");
  };

  const handleSend = async () => {
    if (!to) {
      toast.error("Please enter recipient email");
      return;
    }
    try {
      const form = new FormData();
      form.append("to", to);
      form.append("subject", subject);
      form.append("body", body);
      attachments.forEach((att, idx) => {
        form.append(`attachments[${idx}]`, att.data, att.filename);
      });

      const res = await fetch("/api/send-email", {
        method: "POST",
        body: form,
      });
      if (!res.ok) throw new Error();
      toast.success("Email sent!");
      setTo("");
      setSubject("");
      setBody("");
      setAttachments([]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to send");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-2 gap-6">
        <Card className="h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle>My Resumes</CardTitle>
          </CardHeader>
          <CardContent className="overflow-auto flex-1">
            {loading ? (
              <p>Loading…</p>
            ) : resumes.length === 0 ? (
              <p>No resumes found.</p>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="pb-2 pr-4">Company</th>
                    <th className="pb-2">Position</th>
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {resumes.map((r) => (
                    <tr key={r.s3_key} className="border-t">
                      <td className="py-2">{r.company}</td>
                      <td className="py-2">{r.position}</td>
                      <td className="py-2">
                        {r.timestamp.replace(
                          /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/,
                          "$1-$2-$3 $4:$5:$6 UTC"
                        )}
                      </td>
                      <td className="py-2 flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopy(r.short_url)}
                        >
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleView(r.short_url)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" onClick={() => handleAttach(r)}>
                          Attach
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        <Card className="h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle>Compose Email</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">To</label>
              <Input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="hr@company.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Application for …"
              />
            </div>
            <div className="flex-1 flex flex-col">
              <label className="block text-sm font-medium mb-1">Body</label>
              <Textarea
                ref={bodyRef}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Hello…, please find my resume attached."
                className="flex-1 resize-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-start w-full">
                {attachments.length > 0 && (
                  <div className="flex-1">
                    <p className="text-sm font-medium">Attachments:</p>
                    <ul className="list-disc list-outside pl-5 text-sm">
                      {attachments.map((att) => (
                        <li key={att.filename}>{att.filename}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-2  w-full justify-end">
                  {attachments.length > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleRemoveAll}
                    >
                      Remove Attachments
                    </Button>
                  )}
                  <Button size="sm" onClick={handleSend}>
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
