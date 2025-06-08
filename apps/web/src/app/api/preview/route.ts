// /api/preview/route.ts
import { NextResponse } from "next/server";
import { execFile } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";

const run = promisify(execFile);

export async function POST(request: Request) {
  const { latexContent } = await request.json();

  if (!latexContent) {
    return NextResponse.json({ error: "No LaTeX provided" }, { status: 400 });
  }

  const tempDir = await fs.mkdtemp("/tmp/latex-");
  const texFile = path.join(tempDir, "preview.tex");
  await fs.writeFile(texFile, latexContent);

  try {
    // Run pdflatex twice to resolve references
    await run("pdflatex", [
      "-halt-on-error",
      "-output-directory",
      tempDir,
      texFile,
    ]);
    await run("pdflatex", [
      "-halt-on-error",
      "-output-directory",
      tempDir,
      texFile,
    ]);

    const pdfPath = path.join(tempDir, "preview.pdf");
    const pdfBuffer = await fs.readFile(pdfPath);
    const pdfBase64 = pdfBuffer.toString("base64");

    return NextResponse.json({ pdf: pdfBase64 });
  } catch (e: any) {
    console.error("LaTeX compile error:", e.stderr || e);
    return NextResponse.json(
      { error: "LaTeX compilation failed", details: e.stderr?.toString() },
      { status: 500 }
    );
  } finally {
    // optional: clean up tempDir
  }
}
