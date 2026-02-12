import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand
} from "@aws-sdk/client-cognito-identity-provider";
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
const cognito = new CognitoIdentityProviderClient({ 
  region: "us-east-1",
  credentials: {
    accessKeyId: creds.accessKeyId,
    secretAccessKey: creds.secretAccessKey,
  },
});

// User Pool ID from aws-exports.js
const userPoolId = "us-east-1_39vz8I2km";
const testUsers = [
  {
    username: "testuser@example.com",
    password: "TestPassword123!",
    email: "testuser@example.com"
  },
  {
    username: "demo@example.com", 
    password: "DemoPassword123!",
    email: "demo@example.com"
  },
  {
    username: "user@test.com",
    password: "UserPassword123!",
    email: "user@test.com"
  }
];

async function createTestUsers() {
  console.log("🔐 Creating test user accounts in AWS Cognito...\n");
  console.log("User Pool ID:", userPoolId);
  console.log("Region: us-east-1\n");
  
  const results = [];
  
  for (const user of testUsers) {
    try {
      console.log(`📝 Creating user: ${user.username}...`);
      
      const params = {
        UserPoolId: userPoolId,
        Username: user.username,
        TemporaryPassword: user.password,
        MessageAction: "SUPPRESS", // Don't send welcome email
        UserAttributes: [
          {
            Name: "email",
            Value: user.email
          },
          {
            Name: "email_verified",
            Value: "true"
          }
        ]
      };
      
      const command = new AdminCreateUserCommand(params);
      const response = await cognito.send(command);
      
      // Set permanent password
      const setPasswordParams = {
        UserPoolId: userPoolId,
        Username: user.username,
        Password: user.password,
        Permanent: true
      };
      
      const setPasswordCommand = new AdminSetUserPasswordCommand(setPasswordParams);
      await cognito.send(setPasswordCommand);
      
      console.log(`✅ User created successfully!\n`);
      
      results.push({
        username: user.username,
        password: user.password,
        email: user.email,
        status: "✅ Created"
      });
      
    } catch (error) {
      if (error.name === "UsernameExistsException") {
        console.log(`⚠️  User already exists: ${user.username}\n`);
        results.push({
          username: user.username,
          password: user.password,
          email: user.email,
          status: "⚠️  Already exists"
        });
      } else {
        console.error(`❌ Error creating user ${user.username}:`, error.message);
        results.push({
          username: user.username,
          password: user.password,
          email: user.email,
          status: `❌ Error: ${error.message}`
        });
      }
    }
  }
  
  console.log("\n" + "=".repeat(70));
  console.log("📊 SIGN-IN CREDENTIALS SUMMARY");
  console.log("=".repeat(70) + "\n");
  
  console.log("Use these credentials to sign in to the Media Upload app:\n");
  
  results.forEach((user, idx) => {
    console.log(`${idx + 1}. ${user.status}`);
    console.log(`   Email:    ${user.email}`);
    console.log(`   Password: ${user.password}`);
    console.log();
  });
  
  console.log("=".repeat(70));
  console.log("📝 IMPORTANT:");
  console.log("- Store these credentials securely");
  console.log("- Do NOT commit passwords to GitHub");
  console.log("- Use these accounts to test authenticated file uploads and downloads");
  console.log("- Sign in to access secure file downloads with proper AWS permissions");
  console.log("=".repeat(70) + "\n");
  
  // Save credentials to a local file (gitignored)
  const credentialsFile = "TEST_CREDENTIALS.txt";
  const credentialsContent = `SIGN-IN CREDENTIALS FOR TESTING
================================

App URL: http://localhost:5173/

Test Accounts:
${results.map(u => `
Email: ${u.email}
Password: ${u.password}
Status: ${u.status}`).join("\n")}

SECURITY NOTES:
- These credentials are for LOCAL TESTING ONLY
- Do NOT use in production
- Do NOT commit this file to GitHub (it should be .gitignored)
- Each user can upload and download files securely when authenticated

FEATURES TO TEST:
1. Sign in with email and password
2. Upload files as authenticated user
3. View all your uploaded files
4. Download files (authenticated users have full access)
5. Sign out from your account
`;
  
  fs.writeFileSync(credentialsFile, credentialsContent);
  console.log(`✅ Credentials saved to: ${credentialsFile}`);
  console.log(`   ⚠️  This file is .gitignored for security\n`);
}

createTestUsers().catch(error => {
  console.error("❌ Fatal error:", error.message);
  process.exit(1);
});
