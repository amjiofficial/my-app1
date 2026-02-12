# 📋 Step-by-Step: Fix App Root Setting in Amplify Console

## 🎯 Goal
Clear the App Root setting so your deployment works correctly.

---

## ✅ METHOD 1: Clear App Root in Existing App (Recommended)

### Step 1: Sign In to AWS Amplify Console

1. **Open your web browser**
2. **Go to:** https://console.aws.amazon.com/amplify/
3. **Sign in with:**
   - **Username:** `dev-saqib`
   - **Password:** `DevOps#3286`
4. **Click "Sign in"**

### Step 2: Select Your App

1. **Look for your app** named `my-app1` in the list
2. **Click on the app name** `my-app1` to open it

### Step 3: Go to App Settings

1. **Look at the left sidebar** (menu on the left side)
2. **Click on "App settings"** (it's usually near the bottom of the menu)
3. **Click on "General"** (under App settings)

### Step 4: Find and Clear App Root

1. **Scroll down** on the General settings page
2. **Look for "App root"** field
3. **Check what it says:**
   - If it shows: `my-media-app` → **DELETE IT** (clear the field)
   - If it's empty → **Leave it empty** ✅

**How to clear it:**
- Click inside the "App root" text box
- **Select all text** (Ctrl+A or click and drag)
- **Press Delete** or **Backspace**
- Make sure the field is **completely empty**

### Step 5: Save Changes

1. **Scroll to the bottom** of the page
2. **Click "Save"** button (usually at the bottom right)
3. **Wait for confirmation** - you should see a success message

### Step 6: Verify Build Settings

1. **Still in App settings**, click **"Build settings"** (in the left menu)
2. **Check these fields:**
   - **App root:** Should show **EMPTY** or blank ✅
   - **Base directory:** Should be **EMPTY** ✅
   - **Build specification:** Should show `amplify.yml` ✅

**If Base directory has anything:**
- Click **"Edit"** button
- Clear the "Base directory" field
- Click **"Save"**

### Step 7: Redeploy

1. **Click "Deployments"** in the left sidebar
2. **Find the latest failed deployment** (should be at the top)
3. **Click the three dots** (⋯) next to the deployment
4. **Click "Redeploy this version"**
5. **Wait for deployment** (5-10 minutes)

---

## ✅ METHOD 2: Delete and Recreate App (If Method 1 Doesn't Work)

### Step 1: Sign In (Same as Above)

1. Go to: https://console.aws.amazon.com/amplify/
2. Sign in: `dev-saqib` / `DevOps#3286`

### Step 2: Delete Current App

1. **Select your app:** `my-app1`
2. **Click "App settings"** → **"General"**
3. **Scroll all the way down** to the bottom
4. **Find "Delete app"** section (usually in red)
5. **Type:** `my-app1` in the confirmation box
6. **Click "Delete"** button
7. **Confirm deletion**

### Step 3: Create New App

1. **Click "New app"** button (top right, blue button)
2. **Select "Host web app"**
3. **Choose "GitHub"** as repository provider
4. **Click "Continue"**

### Step 4: Connect GitHub

**If first time:**
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

1. **App name:** Type `my-app1`

2. **App root:** ⚠️ **LEAVE THIS EMPTY** - Don't type anything!

3. **Base directory:** ⚠️ **LEAVE THIS EMPTY** - Don't type anything!

4. **Build specification:** Should auto-detect `amplify.yml` ✅

5. **Backend section:**
   - ✅ Check **"Connect to an existing Amplify backend app"**
   - **App ID:** Type `d1srnkloi1jl6k`
   - **Environment:** Select `dev`

6. **Click "Next"**

### Step 6: Review and Deploy

1. **Review the settings:**
   - Repository: `amjiofficial/my-app1` ✅
   - Branch: `main` ✅
   - App root: **(empty)** ✅
   - Backend: Connected to `d1srnkloi1jl6k` ✅

2. **Click "Save and deploy"**

3. **Wait 5-10 minutes** for deployment

---

## ✅ METHOD 3: Edit Build Settings Directly

### Step 1: Sign In

1. Go to: https://console.aws.amazon.com/amplify/
2. Sign in: `dev-saqib` / `DevOps#3286`
3. Select app: `my-app1`

### Step 2: Edit Build Settings

1. **Click "App settings"** → **"Build settings"**
2. **Click "Edit"** button (top right)
3. **Find "App root"** field
4. **Clear it** (make it empty)
5. **Find "Base directory"** field
6. **Clear it** (make it empty)
7. **Click "Save"**

### Step 3: Redeploy

1. Go to **"Deployments"**
2. Click **"Redeploy this version"**

---

## 🎯 Visual Guide - What to Look For

### App Root Field Location:
```
App settings → General → App root: [my-media-app] ← DELETE THIS
```

### Build Settings Location:
```
App settings → Build settings → App root: [my-media-app] ← CLEAR THIS
```

### What It Should Look Like After Fix:
```
App root: [empty/blank] ✅
Base directory: [empty/blank] ✅
```

---

## ✅ Verification Checklist

After fixing, verify:
- [ ] App Root = **EMPTY** (not set to anything)
- [ ] Base Directory = **EMPTY** (not set to anything)
- [ ] Build spec = `amplify.yml`
- [ ] Backend connected to `d1srnkloi1jl6k`
- [ ] Changes saved
- [ ] Redeploy triggered

---

## 🚨 Common Mistakes to Avoid

❌ **DON'T** set App Root to `my-media-app`
❌ **DON'T** set Base Directory to anything
❌ **DON'T** forget to click Save
❌ **DON'T** skip the redeploy step

✅ **DO** leave App Root empty
✅ **DO** leave Base Directory empty
✅ **DO** save changes
✅ **DO** redeploy after fixing

---

## 📞 If You Get Stuck

1. **Take a screenshot** of your Build settings page
2. **Check the exact error** in deployment logs
3. **Verify** you're signed in to the correct AWS account
4. **Make sure** you're in the `us-east-1` region

---

**Follow these steps exactly, and your deployment will work! 🚀**
