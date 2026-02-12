import { IAMClient, GetRolePolicyCommand, PutRolePolicyCommand } from "@aws-sdk/client-iam";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

// Load credentials from ~/.aws/credentials file manually
function loadAWSCredentials() {
  const credFile = path.join(os.homedir(), ".aws", "credentials");
  const content = fs.readFileSync(credFile, "utf8");
  const lines = content.split("\n");
  
  let profile = "fateh-dev";
  let credentials = {};
  let inProfile = false;
  
  for (const line of lines) {
    if (line.startsWith(`[${profile}]`)) {
      inProfile = true;
      continue;
    }
    if (inProfile && line.startsWith("[")) {
      break;
    }
    if (inProfile) {
      const [key, value] = line.split("=");
      if (key && value) {
        credentials[key.trim()] = value.trim();
      }
    }
  }
  
  return {
    accessKeyId: credentials["aws_access_key_id"],
    secretAccessKey: credentials["aws_secret_access_key"],
  };
}

const creds = loadAWSCredentials();
const client = new IAMClient({ 
  region: "us-east-1",
  credentials: {
    accessKeyId: creds.accessKeyId,
    secretAccessKey: creds.secretAccessKey,
  },
});

const unauthRoleName = "amplify-mediaupload-dev-47cb2-unauthRole";
const policyName = "Uploads_policy_f3ce6075";

async function updatePolicy() {
  try {
    console.log("📋 Fetching current policy for", unauthRoleName);
    console.log("Policy name:", policyName);
    
    // Get current policy
    const getPolicyCommand = new GetRolePolicyCommand({
      RoleName: unauthRoleName,
      PolicyName: policyName,
    });
    
    const response = await client.send(getPolicyCommand);
    console.log("✅ Current policy fetched");
    
    // Parse the policy document
    const policyDocument = JSON.parse(decodeURIComponent(response.RolePolicyList[0].PolicyDocument));
    
    console.log("\nCurrent Statement count:", policyDocument.Statement.length);
    console.log("Current Actions:", JSON.stringify(policyDocument.Statement[0]?.Action, null, 2));
    
    // Add s3:GetObject to each statement
    let updated = false;
    policyDocument.Statement.forEach((stmt, idx) => {
      if (stmt.Resource && stmt.Resource.includes("uploads")) {
        if (Array.isArray(stmt.Action)) {
          if (!stmt.Action.includes("s3:GetObject")) {
            stmt.Action.push("s3:GetObject");
            updated = true;
            console.log(`\n✏️ Added s3:GetObject to statement ${idx}`);
          }
        } else if (typeof stmt.Action === "string") {
          if (stmt.Action !== "s3:GetObject" && !stmt.Action.includes("s3:GetObject")) {
            stmt.Action = [stmt.Action, "s3:GetObject"];
            updated = true;
            console.log(`\n✏️ Added s3:GetObject to statement ${idx}`);
          }
        }
      }
    });
    
    if (!updated) {
      console.log("\n⚠️  No updates needed - s3:GetObject already present or statement structure different");
    }
    
    console.log("\nNew Statement Actions:", JSON.stringify(policyDocument.Statement[0]?.Action, null, 2));
    
    // Put updated policy
    const putPolicyCommand = new PutRolePolicyCommand({
      RoleName: unauthRoleName,
      PolicyName: policyName,
      PolicyDocument: JSON.stringify(policyDocument),
    });
    
    await client.send(putPolicyCommand);
    console.log("\n✅ Policy updated successfully!");
    console.log("Guest users can now download uploaded files");
    
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    if (error.Code === 'NoSuchEntity') {
      console.error("Policy or role not found. Verify the names:");
      console.error("  Role:", unauthRoleName);
      console.error("  Policy:", policyName);
    }
  }
}

updatePolicy();
