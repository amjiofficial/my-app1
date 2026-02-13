# 🚀 Complete Deployment Solution - Fix IAM Role & Deploy

## 🔍 Problem Summary

**Error:** "Unable to assume specified IAM Role"
**Current Service Role:** `amplify-drce9fsz49vz-main-amplifyAuthauthenticatedU-Am0vfxmrPxu5`
**Issue:** This role is for Auth, not Hosting - needs correct trust relationship or new role

## ✅ Complete Solution Steps

### Step 1: AWS Credentials (Already Configured ✅)

Your AWS credentials are configured in `.aws/credentials` file:
- Access Key: Configured ✅
- Secret Key: Configured ✅
- Region: `us-east-1`

### Step 2: Fix IAM Service Role in Amplify Console

#### Option A: Create New Service Role (RECOMMENDED - Easiest)

1. **Sign in to AWS Amplify Console:**
   - URL: https://console.aws.amazon.com/amplify/
   - Username: `dev-saqib`
   - Password: `DevOps#3286`

2. **Navigate to App Settings:**
   - Select app: `my-app1`
   - Click **"App settings"** (left sidebar)
   - Click **"General"**

3. **Create New Service Role:**
   - Find **"Service role"** section
   - Click **"Create new role"** button
   - IAM window opens in new tab
   - Review permissions (should include Amplify, S3, CloudFront, CodeBuild)
   - Click **"Allow"** to create role
   - Role is created automatically with correct trust relationship

4. **Assign New Role:**
   - Return to Amplify Console tab
   - Refresh page if needed
   - In **"Service role"** dropdown, select the newly created role
   - Click **"Save"**

5. **Verify:**
   - New role should appear (name like `amplify-my-app1-xxxxx`)
   - Should NOT be the Auth role name

#### Option B: Fix Existing Role Trust Relationship

1. **Go to IAM Console:**
   - URL: https://console.aws.amazon.com/iam/
   - Sign in: `dev-saqib` / `DevOps#3286`

2. **Find the Role:**
   - Click **"Roles"** in left sidebar
   - Search for: `amplify-drce9fsz49vz-main-amplifyAuthauthenticatedU-Am0vfxmrPxu5`
   - Click on the role name

3. **Edit Trust Relationship:**
   - Click **"Trust relationships"** tab
   - Click **"Edit trust policy"**
   - Replace with:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "amplify.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

   - Click **"Update policy"**

4. **Return to Amplify Console:**
   - Go back to Amplify Console
   - App settings → General
   - Verify service role is selected
   - Click **"Save"**

### Step 3: Verify All Amplify Console Settings

1. **App Root Setting:**
   - App settings → General → **App root**: **EMPTY** (not set)
   - This matches `amplify.yml` with `baseDirectory: my-media-app/dist`

2. **Build Settings:**
   - App settings → Build settings:
     - **App root**: **EMPTY** ✅
     - **Base directory**: **EMPTY** ✅
     - **Build specification**: `amplify.yml` ✅

3. **Backend Connection:**
   - Verify backend is connected to: `d1srnkloi1jl6k` (dev)
   - This ensures `aws-exports.js` is auto-generated

### Step 4: Verify Build Configuration

**Current `amplify.yml` is correct:**
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd my-media-app
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: my-media-app/dist
    files:
      - '**/*'
  cache:
    paths:
      - my-media-app/node_modules/**/*
```

**This works when App Root is empty in Console.**

### Step 5: Redeploy

1. **Go to Deployments:**
   - Click **"Deployments"** in left sidebar
   - Find latest failed deployment

2. **Trigger Redeploy:**
   - Click three dots (⋯) next to deployment
   - Click **"Redeploy this version"**
   - OR create a new commit to trigger auto-deploy

3. **Monitor Deployment:**
   - Watch build logs
   - Should see: ✅ No IAM role errors
   - Build completes (~50-60 seconds)
   - Deploy succeeds (not cancelled)

## 🎯 Expected Result

After fixing IAM role:
- ✅ Build phase: Completes without IAM errors
- ✅ Artifacts: Found at `my-media-app/dist`
- ✅ Deploy phase: Succeeds
- ✅ Status: **Deployed** ✅
- ✅ App URL: `https://main.d3bgl2axms2osa.amplifyapp.com` works!

## 📋 Quick Checklist

- [ ] Signed in to Amplify Console
- [ ] Created new service role (Option A) OR fixed trust relationship (Option B)
- [ ] New role selected in Amplify Console
- [ ] App Root = EMPTY
- [ ] Base Directory = EMPTY
- [ ] Backend connected to `d1srnkloi1jl6k`
- [ ] Changes saved
- [ ] Redeploy triggered
- [ ] Build logs show no IAM errors
- [ ] Deployment succeeds

## 🔧 Troubleshooting

**If "Create new role" doesn't work:**
- Verify you have IAM permissions
- Try Option B (fix existing role)
- Check if you're signed in as correct user

**If deployment still fails:**
- Check build logs for specific errors
- Verify role ARN is correct
- Ensure App Root is empty
- Verify backend connection

---

**Follow these steps exactly - your deployment will work! 🚀**
