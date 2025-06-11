import { NextResponse } from "next/server";
import AWS from "aws-sdk";

const DDB_TABLE = process.env.DDB_TABLE || "ResumeMetadata";
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const ddb = new AWS.DynamoDB.DocumentClient();

export async function GET() {
  try {
    const result = await ddb
      .scan({
        TableName: DDB_TABLE,
        ProjectionExpression: "s3_key, company, #ts, short_url",
        ExpressionAttributeNames: {
          "#ts": "timestamp",
        },
      })
      .promise();

    const items = result.Items || [];
    console.log("Fetched items:", items);
    items.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
    return NextResponse.json(items);
  } catch (err) {
    console.error("Error fetching resumes from DynamoDB", err);
    return NextResponse.json(
      { error: "Failed to fetch resumes" },
      { status: 500 }
    );
  }
}
