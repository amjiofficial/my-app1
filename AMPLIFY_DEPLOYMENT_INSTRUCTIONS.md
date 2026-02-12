# 🚀 Deploy to AWS Amplify Hosting - Connect to Existing Backend

## ✅ Current Configuration

- **S3 Bucket:** `jan-media-dev-2026` (us-east-1)
- **Cognito User Pool:** `us-east-1_39vz8I2km`
- **Cognito Identity Pool:** `us-east-1:c8bcb438-8dfc-48fb-8b31-f35ad3beb8e8`
- **Amplify App ID:** `d1srnkloi1jl6k`
- **Region:** `us-east-1`

## 📋 Step-by-Step Deployment

### Step 1: Access AWS Amplify Console

1. Go to: https://console.aws.amazon.com/amplify/
2. Sign in with your AWS account
3. Make sure you're in the **us-east-1** region (top right)

### Step 2: Connect to Existing Amplify Backend

**IMPORTANT:** You need to connect the Hosting app to your existing Amplify backend.

1. Click **"New app"** → **"Host web app"**
2. Select **"GitHub"**
3. Authorize and select repository: `amjiofficial/my-app1`
4. Select branch: `main`
5. Click **"Next"**

### Step 3: Connect Backend (CRITICAL STEP)

On the **"Configure build settings"** page:

1. **App name:** `my-app1` (or your preferred name)

2. **Backend:** 
   - ✅ Select **"Connect to an existing Amplify backend app"**
   - **App ID:** `d1srnkloi1jl6k`
   - **Environment:** `dev`
   - This connects to your existing S3 bucket and Cognito!

3. **Build settings:**
   - Build specification: `amplify.yml` (auto-detected)
   - Base directory: Leave empty
   - App root: Leave empty

4. Click **"Next"**

### Step 4: Review and Deploy

1. Review configuration:
   - ✅ Repository: `amjiofficial/my-app1`
   - ✅ Branch: `main`
   - ✅ Backend: Connected to `d1srnkloi1jl6k` (dev)
   - ✅ Build: `amplify.yml`

2. Click **"Save and deploy"**

3. **Wait for deployment** (5-10 minutes):
   - Amplify will:
     - Install dependencies
     - Generate `aws-exports.js` automatically (connected to your backend)
     - Build your React app
     - Deploy to CDN

### Step 5: Verify Connection

After deployment completes:

1. **Check App URL:** Click the provided URL (e.g., `https://xxxxx.amplifyapp.com`)

2. **Test Upload:**
   - Upload an image/video
   - Verify it appears in S3 bucket: `jan-media-dev-2026`
   - Check the `uploads/` folder in S3

3. **Test Authentication:**
   - Try guest upload (should work)
   - Try signing in (should work)

## ✅ What This Ensures

- ✅ Uses existing S3 bucket: `jan-media-dev-2026`
- ✅ Uses existing Cognito: `us-east-1_39vz8I2km`
- ✅ Uses existing Identity Pool: `us-east-1:c8bcb438-8dfc-48fb-8b31-f35ad3beb8e8`
- ✅ All existing functionality preserved
- ✅ No new resources created
- ✅ Auto-generates `aws-exports.js` during build

## 🔄 Auto-Deployment

After initial deployment:
- Every `git push` to `main` branch automatically triggers a new deployment
- Your live site updates automatically
- Backend connection remains intact

## 🛠️ Troubleshooting

### If Backend Connection Option Doesn't Appear

1. Make sure you're in the **same AWS account** where the backend was created
2. Verify Amplify App ID: `d1srnkloi1jl6k` exists
3. Check region is **us-east-1**

### If Files Don't Upload to S3

1. Verify S3 bucket exists: `jan-media-dev-2026`
2. Check IAM roles:
   - `amplify-mediaupload-dev-47cb2-authRole`
   - `amplify-mediaupload-dev-47cb2-unauthRole`
3. Verify bucket permissions in Amplify Console

### If Authentication Doesn't Work

1. Verify Cognito User Pool: `us-east-1_39vz8I2km`
2. Check Identity Pool: `us-east-1:c8bcb438-8dfc-48fb-8b31-f35ad3beb8e8`
3. Verify `aws-exports.js` is generated correctly (check build logs)

## 📝 Important Notes

- **aws-exports.js** is automatically generated during build (don't commit it)
- The file connects to your existing backend resources
- No manual configuration needed - Amplify handles it
- Your existing S3 bucket and Cognito remain unchanged

---

**Ready to deploy! Follow the steps above to connect to your existing backend! 🚀**
