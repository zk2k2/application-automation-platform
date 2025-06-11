import { NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";
import AWS from "aws-sdk";

const OWNER = process.env.GITHUB_RESUME_REPO_OWNER!;
const REPO = process.env.GITHUB_RESUME_REPO_NAME!;
const TOKEN = process.env.GITHUB_RESUME_REPO_TOKEN!;
const WORKFLOW_ID = "main.yml";
const DDB_TABLE = process.env.DDB_TABLE || "ResumeMetadata";

const octokit = new Octokit({ auth: TOKEN });

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const ddb = new AWS.DynamoDB.DocumentClient();

async function fetchShortUrlWithBackoff(
  key: string,
  maxRetries = 5
): Promise<string> {
  let attempt = 0;
  let delay = 500;

  while (attempt < maxRetries) {
    const resp = await ddb
      .get({
        TableName: DDB_TABLE,
        Key: { s3_key: key },
        ConsistentRead: true,
      })
      .promise();

    if (resp.Item && resp.Item.short_url) {
      return resp.Item.short_url;
    }

    attempt++;
    console.log(
      `Attempt ${attempt} failed to fetch short_url. Retrying in ${delay}ms...`
    );
    await sleep(delay);
    delay *= 2;
  }

  throw new Error(
    `Short URL not found after ${maxRetries} attempts for key ${key}`
  );
}

export async function POST(req: Request) {
  try {
    const { latexContent, commitMessage } = await req.json();

    if (!latexContent || !commitMessage) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }

    const tsMatch = commitMessage.match(/(\d{8}T\d{6}Z)$/);
    if (!tsMatch) {
      throw new Error("No timestamp found in commit message");
    }
    const timestamp = tsMatch[1];
    let fileSha: string | undefined;
    try {
      const { data: fileData } = await octokit.repos.getContent({
        owner: OWNER,
        repo: REPO,
        path: "resume.tex",
        ref: "main",
      });
      if ("sha" in fileData) fileSha = fileData.sha;
    } catch {}

    const commitResp = await octokit.repos.createOrUpdateFileContents({
      owner: OWNER,
      repo: REPO,
      path: "resume.tex",
      message: commitMessage,
      content: Buffer.from(latexContent).toString("base64"),
      sha: fileSha,
      branch: "main",
    });
    const commitSha = commitResp.data.commit.sha;

    let workflowRun;
    for (let i = 0; i < 60; i++) {
      const runs = await octokit.actions.listWorkflowRuns({
        owner: OWNER,
        repo: REPO,
        workflow_id: WORKFLOW_ID,
        event: "push",
        branch: "main",
        per_page: 5,
      });
      const run = runs.data.workflow_runs.find((r) => r.head_sha === commitSha);
      if (run && run.status === "completed") {
        workflowRun = run;
        break;
      }
      await sleep(5000);
    }
    if (!workflowRun) {
      return NextResponse.json(
        { error: "Timeout waiting for workflow run" },
        { status: 500 }
      );
    }

    const company = commitMessage
      .replace(/^Applying to\s*/i, "")
      .replace(/\s+as\s+.*?\s+at\s+\d{8}T\d{6}Z$/i, "")
      .toUpperCase()
      .replace(/\s+/g, "");

    const filename = `RESUME_${company}_${timestamp}.pdf`;
    console.log(`Generated filename: ${filename}`);
    const s3Key = `resumes/${filename}`;

    const shortUrl = await fetchShortUrlWithBackoff(s3Key);

    return NextResponse.json({ shortUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}
