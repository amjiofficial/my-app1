# 🔧 Fix Deployment "Deploy Cancelled" Error

## ⚠️ The Problem

Build completes successfully but **"Deploy cancelled"** error occurs. This happens because Amplify can't find the built files.

## ✅ The Solution

You need to set **App Root** in Amplify Console AND update the `baseDirectory` in `amplify.yml`.

### Step 1: Update Amplify Console Settings

1. Go to: https://console.aws.amazon.com/amplify/
2. Select your app: `my-app1`
3. Click **"App settings"** → **"General"**
4. Find **"App root"** field
5. Set to: `my-media-app`
6. Click **"Save"**

### Step 2: Verify Build Settings

In **"Build settings"**:
- **App root:** `my-media-app` ✅
- **Base directory:** Leave **EMPTY** ✅
- **Build specification:** `amplify.yml` ✅

### Step 3: Redeploy

1. Go to **"Deployments"**
2. Click **"Redeploy this version"** on the latest deployment
3. Or wait for auto-deploy from new commit

## 📝 Why This Works

When **App root** is set to `my-media-app`:
- Amplify changes working directory to `my-media-app/`
- Build commands run from `my-media-app/`
- `dist` folder is created in `my-media-app/dist`
- `baseDirectory: dist` is relative to appRoot, so it finds `my-media-app/dist`

## 🔍 If Still Failing

Check the **build logs** in Amplify Console:
1. Go to your deployment
2. Click on the deployment
3. Check **"Build logs"** tab
4. Look for errors about:
   - File not found
   - Path issues
   - Missing index.html

## 🎯 Expected Behavior

After setting App Root correctly:
- ✅ Build phase: Completes successfully
- ✅ Deploy phase: Finds files and deploys
- ✅ Status: **Deployed** (not cancelled)

---

**Set App Root to `my-media-app` in Amplify Console! This is the key fix! 🚀**
