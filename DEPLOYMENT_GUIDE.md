# 🚀 AWS Amplify Hosting Deployment Guide

## ✅ Pre-Deployment Checklist

- ✅ Project pushed to GitHub: `https://github.com/amjiofficial/my-app1.git`
- ✅ AWS credentials configured
- ✅ S3 bucket configured: `jan-media-dev-2026`
- ✅ Cognito authentication set up
- ✅ Amplify build configuration (`amplify.yml`) created
- ✅ All code committed and pushed

## 📋 Step-by-Step Deployment Instructions

### Step 1: Access AWS Amplify Console

1. Go to [AWS Console](https://console.aws.amazon.com/)
2. Sign in with your AWS account
3. Search for "Amplify" in the services search bar
4. Click on **AWS Amplify**

### Step 2: Create New App

1. Click **"New app"** button (top right)
2. Select **"Host web app"**
3. Choose **"GitHub"** as your repository provider
4. Click **"Continue"**

### Step 3: Connect GitHub Repository

1. **First time connecting:**
   - Click **"Authorize AWS Amplify"**
   - Sign in to GitHub
   - Authorize AWS Amplify to access your repositories
   - Select **"Only select repositories"**
   - Choose **"my-app1"**
   - Click **"Install & Authorize"**

2. **If already connected:**
   - Select **"amjiofficial/my-app1"** from the repository dropdown
   - Select branch: **"main"**
   - Click **"Next"**

### Step 4: Configure Build Settings

Amplify will auto-detect the `amplify.yml` file. Verify these settings:

**App name:** `my-app1` (or your preferred name)

**Build settings:**
- **Build specification:** `amplify.yml` (should be auto-detected)
- **Base directory:** Leave empty (root of repo)
- **App root:** Leave empty

**Environment variables:** (Optional - Amplify will auto-generate aws-exports.js)
- No additional variables needed

Click **"Next"**

### Step 5: Review and Deploy

1. Review your configuration:
   - Repository: `amjiofficial/my-app1`
   - Branch: `main`
   - Build settings: `amplify.yml`

2. Click **"Save and deploy"**

3. **Wait for deployment** (5-10 minutes):
   - Build phase: Installing dependencies
   - Build phase: Building your app
   - Deploy phase: Deploying to CDN
   - ✅ **Deployment successful!**

### Step 6: Access Your Live App

1. Once deployment completes, you'll see:
   - **App URL:** `https://xxxxx.amplifyapp.com`
   - Click the URL to open your live app!

2. **Test your app:**
   - Upload an image/video
   - Verify it saves to S3 bucket: `jan-media-dev-2026`
   - Test authentication (sign in/guest upload)

## 🔧 Configuration Details

### Build Configuration (`amplify.yml`)

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

### AWS Services Connected

- **S3 Bucket:** `jan-media-dev-2026` (us-east-1)
- **Cognito User Pool:** `us-east-1_39vz8I2km`
- **Cognito Identity Pool:** `us-east-1:c8bcb438-8dfc-48fb-8b31-f35ad3beb8e8`
- **Region:** `us-east-1`

## 🔄 Auto-Deployment

After initial deployment, **every time you push to GitHub**, Amplify will:
1. Automatically detect changes
2. Start a new build
3. Deploy the updated app
4. Your live site updates automatically! 🎉

## 📝 Future Updates

To update your live app:

```bash
cd "C:\Users\EHSAN LAPTOP\Downloads\MediaUpload-to-AWS-main\MediaUpload-to-AWS-main"
git add .
git commit -m "Your update message"
git push origin main
```

Amplify will automatically build and deploy within 3-5 minutes!

## 🛠️ Troubleshooting

### Build Fails

1. Check build logs in Amplify Console
2. Verify `amplify.yml` syntax is correct
3. Ensure all dependencies are in `package.json`
4. Check Node.js version (should be auto-detected)

### App Not Loading

1. Check browser console for errors
2. Verify `aws-exports.js` is generated (Amplify does this automatically)
3. Check S3 bucket permissions
4. Verify Cognito configuration

### Files Not Uploading

1. Verify S3 bucket exists: `jan-media-dev-2026`
2. Check IAM permissions for Cognito roles
3. Verify bucket CORS configuration
4. Check browser console for errors

## 📞 Support

- **AWS Amplify Docs:** https://docs.amplify.aws/
- **Amplify Console:** https://console.aws.amazon.com/amplify/
- **GitHub Repo:** https://github.com/amjiofficial/my-app1

---

**Your app is ready to deploy! Follow the steps above to go live! 🚀**
