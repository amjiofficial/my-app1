# 🚨 URGENT: Fix IAM Role Error - Step by Step

## Current Error
```
Unable to assume specified IAM Role. Please ensure the selected IAM Role has 
sufficient permissions and the Trust Relationship is configured correctly.
```

## ✅ SOLUTION: Create New Service Role (Must Do This)

### Step 1: Go to Amplify Console
1. Open: https://console.aws.amazon.com/amplify/
2. Sign in: `dev-saqib` / `DevOps#3286`
3. Select app: `my-app1`

### Step 2: Access Service Role Settings
1. Click **"App settings"** (left sidebar)
2. Click **"General"**
3. Scroll to **"Service role"** section

### Step 3: Create New Role (CRITICAL)
1. **Click "Edit"** next to Service role (or find "Create new role" button)
2. **Click "Create new role"**
3. A new IAM window/tab will open
4. **Review the policy** - it should show permissions for:
   - Amplify service
   - S3 access
   - CloudFront access
   - CodeBuild access
5. **Click "Allow"** button (bottom right of IAM window)
6. Role is created automatically

### Step 4: Select and Save New Role
1. **Return to Amplify Console tab**
2. **Refresh the page** if needed (F5)
3. In **"Service role"** dropdown, you should see the new role
4. **Select the new role** (name will be different from the Auth role)
5. **Click "Save"** button
6. Wait for confirmation message

### Step 5: Verify Role is Selected
- The dropdown should show the new role name
- Should NOT show: `amplify-drce9fsz49vz-main-amplifyAuthauthenticatedU-Am0vfxmrPxu5`
- Should show something like: `amplify-my-app1-xxxxx` or similar

### Step 6: Redeploy Immediately
1. Click **"Deployments"** in left sidebar
2. Find latest failed deployment
3. Click three dots (⋯) → **"Redeploy this version"**
4. OR wait for auto-deploy (new commit will trigger it)

## 🔍 If "Create New Role" Button Doesn't Appear

### Alternative Method:
1. In Service role section, click **"Edit"**
2. Look for **"Use an existing service role"** option
3. Click **"Create new role"** link/button
4. Follow steps above

## 🔧 If You Must Fix Existing Role (Not Recommended)

### Go to IAM Console:
1. Open: https://console.aws.amazon.com/iam/
2. Sign in: `dev-saqib` / `DevOps#3286`
3. Click **"Roles"** → Search for: `amplify-drce9fsz49vz-main-amplifyAuthauthenticatedU-Am0vfxmrPxu5`
4. Click role name
5. **"Trust relationships"** tab → **"Edit trust policy"**
6. Replace entire policy with:

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

7. Click **"Update policy"**
8. Return to Amplify Console → Save → Redeploy

## ✅ Expected Result After Fix

Build logs should show:
- ✅ No "Unable to assume IAM Role" error
- ✅ "Build environment configured" message
- ✅ Build proceeds normally
- ✅ Deployment succeeds

## 📋 Quick Checklist

- [ ] Opened Amplify Console
- [ ] App settings → General
- [ ] Clicked "Create new role"
- [ ] Clicked "Allow" in IAM window
- [ ] Selected new role in dropdown
- [ ] Clicked "Save"
- [ ] Redeployed
- [ ] Build logs show no IAM errors

---

**DO THIS NOW: Create a new service role - it's the fastest solution! 🚀**
