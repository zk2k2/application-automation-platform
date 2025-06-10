import { NextResponse } from "next/server";

export async function GET() {
  try {
    const token = process.env.GITHUB_RESUME_REPO_TOKEN;
    const owner = process.env.GITHUB_RESUME_REPO_OWNER;
    const repo = process.env.GITHUB_RESUME_REPO_NAME;
    const path = process.env.GITHUB_RESUME_REPO_PATH;

    if (!token || !owner || !repo || !path) {
      console.error(
        "Missing environment variables: GITHUB_RESUME_REPO_TOKEN, GITHUB_RESUME_REPO_OWNER, GITHUB_RESUME_REPO_PATH or GITHUB_RESUME_REPO_NAME"
      );
      return new NextResponse(
        JSON.stringify({
          error: "Server configuration error",
          details:
            "Ensure GITHUB_RESUME_REPO_TOKEN, GITHUB_REPO_OWNER, GITHUB_RESUME_REPO_PATH and GITHUB_REPO_NAME are set in the environment variables.",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3.raw",
        "User-Agent": "NextJS-App",
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`GitHub API Error: ${response.status} - ${errorBody}`);
      throw new Error(
        `GitHub API responded with status ${response.status}: ${errorBody}`
      );
    }

    const resumeContent = await response.text();
    return new NextResponse(resumeContent, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error) {
    console.error("Error fetching resume:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Failed to fetch resume",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
