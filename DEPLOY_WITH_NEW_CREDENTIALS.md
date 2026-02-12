# 🚀 Deploy to AWS Amplify - Step by Step Guide

## ✅ AWS Account Information

- **Account ID:** `707925622438`
- **Console URL:** https://707925622438.signin.aws.amazon.com/console
- **Username:** `dev-saqib`
- **Region:** `us-east-1`
- **Amplify Backend App ID:** `d1srnkloi1jl6k`
- **Environment:** `dev`

## 📋 Deployment Steps

### Step 1: Sign in to AWS Console

1. Open your browser
2. Go to: **https://707925622438.signin.aws.amazon.com/console**
3. Enter credentials:
   - **Username:** `dev-saqib`
   - **Password:** `DevOps#3286`
4. Click **"Sign in"**

### Step 2: Navigate to AWS Amplify

1. Once signed in, search for **"Amplify"** in the top search bar
2. Click on **"AWS Amplify"** service
3. Make sure region is set to **"us-east-1"** (top right)

### Step 3: Create New App

1. Click **"New app"** button (top right)
2. Select **"Host web app"**
3. Choose **"GitHub"** as repository provider
4. Click **"Continue"**

### Step 4: Connect GitHub Repository

**If first time connecting GitHub:**
1. Click **"Authorize AWS Amplify"**
2. Sign in to GitHub
3. Select **"Only select repositories"**
4. Choose **"my-app1"**
5. Click **"Install & Authorize"**

**If already connected:**
1. Select repository: **`amjiofficial/my-app1`**
2. Select branch: **`main`**
3. Click **"Next"**

### Step 5: Configure Build Settings ⚠️ CRITICAL

On the **"Configure build settings"** page:

1. **App name:** `my-app1` (or your preferred name)

2. **Backend section (IMPORTANT):**
   - ✅ Check **"Connect to an existing Amplify backend app"**
   - **App ID:** Enter `d1srnkloi1jl6k`
   - **Environment:** Select `dev`
   - This connects to your existing S3 bucket (`jan-media-dev-2026`) and Cognito!

3. **Build settings:**
   - **Build specification:** `amplify.yml` (should be auto-detected)
   - **Base directory:** Leave **EMPTY**
   - **App root:** Leave **EMPTY** (or set to `my-media-app` if option available)

4. Click **"Next"**

### Step 6: Review and Deploy

1. **Review settings:**
   - Repository: `amjiofficial/my-app1` ✅
   - Branch: `main` ✅
   - Backend: Connected to `d1srnkloi1jl6k` (dev) ✅
   - Build spec: `amplify.yml` ✅

2. Click **"Save and deploy"**

3. **Wait for deployment** (5-10 minutes):
   - Build phase: Installing dependencies
   - Build phase: Building React app
   - Deploy phase: Deploying to CDN
   - ✅ **Deployment successful!**

### Step 7: Access Your Live App

1. Once deployment completes, you'll see:
   - **App URL:** `https://xxxxx.amplifyapp.com`
   - Click the URL to open your live app!

2. **Test your app:**
   - Upload an image/video
   - Verify it saves to S3: `jan-media-dev-2026` → `uploads/` folder
   - Test authentication (sign in/guest upload)

## ✅ What This Ensures

- ✅ Uses existing S3 bucket: `jan-media-dev-2026`
- ✅ Uses existing Cognito: `us-east-1_39vz8I2km`
- ✅ Uses existing Identity Pool: `us-east-1:c8bcb438-8dfc-48fb-8b31-f35ad3beb8e8`
- ✅ All existing functionality preserved
- ✅ Auto-generates `aws-exports.js` during build
- ✅ No new resources created

## 🔄 Auto-Deployment

After initial deployment:
- Every `git push` to `main` branch automatically triggers new deployment
- Your live site updates automatically
- Backend connection remains intact

## 🛠️ Troubleshooting

### If Build Fails
1. Check build logs in Amplify Console
2. Verify `amplify.yml` syntax
3. Ensure all dependencies in `package.json`
4. Check TypeScript compilation errors

### If Deploy is Cancelled
1. Check deploy logs for errors
2. Verify `baseDirectory` path is correct
3. Ensure build artifacts are generated
4. Check file permissions

### If Backend Connection Fails
1. Verify Amplify App ID: `d1srnkloi1jl6k`
2. Check environment: `dev`
3. Ensure you're in correct AWS account: `707925622438`
4. Verify region: `us-east-1`

## 📝 Quick Reference

- **AWS Console:** https://707925622438.signin.aws.amazon.com/console
- **Amplify Console:** https://console.aws.amazon.com/amplify/
- **GitHub Repo:** https://github.com/amjiofficial/my-app1.git
- **Backend App ID:** `d1srnkloi1jl6k`
- **S3 Bucket:** `jan-media-dev-2026`
- **Region:** `us-east-1`

---

**Ready to deploy! Follow the steps above! 🚀**
