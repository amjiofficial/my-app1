# 🔐 Testing Guide - Sign In with Test Credentials

## Welcome! 👋

Your Media Upload app is now ready for testing with **authentication enabled**. Here's everything you need to know:

---

## **Test Accounts Available**

Use any of these credentials to sign in:

### Account 1: Test User
```
Email:    testuser@example.com
Password: TestPassword123!
```

### Account 2: Demo User
```
Email:    demo@example.com
Password: DemoPassword123!
```

### Account 3: Test Account
```
Email:    user@test.com
Password: UserPassword123!
```

---

## **How to Test Features**

### 🔓 **Sign In Steps:**

1. **Open the App**: Go to http://localhost:5173/
2. **Click "Sign In with Email"** button (if not signed in)
3. **Enter Email**: Use any of the test accounts above
4. **Enter Password**: Use the corresponding password
5. **Click Sign In** - You're now authenticated! ✅

### 📤 **Upload Files (Authenticated)**

1. **After signing in**, select "Choose File"
2. **Pick an image or video** from your computer
3. **Click "Upload"** - File uploads to AWS S3
4. **SeeYour online links list** below showing the uploaded file

### 📥 **Download Files (Authenticated)**

1. **Find your file** in the "Your Uploaded Files" table
2. **Click "Copy Full Link"** to get the download URL
3. **Open the link in a new tab** to view/download the file
4. ✅ **Direct downloads work when authenticated** with proper AWS permissions

### 🚀 **Guest Upload (No Sign In)**

1. **Don't sign in** - Files can still be uploaded as guest
2. **Choose File** → **Click Upload**
3. **See online links** - Links can be shared (must sign in user to download directly)

---

## **File Management**

### **Your Uploaded Files Table Shows:**
- ✅ **File Name** - Original file name and upload time
- ✅ **Online Link** - Full AWS S3 URL (truncated view)
- ✅ **Actions**:
  - **ℹ️ Info** - Learn about sign-in benefits
  - **Copy Full Link** - Share URLs with others

### **Link Expiration:**
- Signed URLs expire after **24 hours**
- Files remain stored in AWS S3 permanently
- Re-sign-in anytime to access fresh links

---

## **Security & Permissions**

| Feature | Guest User | Authenticated User |
|---------|------------|-------------------|
| Upload Files | ✅ Yes | ✅ Yes |
| View Links | ✅ Yes | ✅ Yes |
| Copy Links | ✅ Yes | ✅ Yes |
| Direct Download | ⚠️ No* | ✅ Yes |
| Manage Files | ✅ View Recent | ✅ Access All |

**\* Guests can share links, but downloads require sign-in for security**

---

## **Sign Out**

1. Click **"Sign Out"** button (visible when signed in)
2. You'll return to guest mode
3. Can still upload and view links

---

## **Important Notes** ⚠️

- ✅ **All test accounts have full permissions**
- ✅ **Passwords are secure** (8+ characters, special chars)
- ✅ **Guest uploads still work** (no sign in needed)
- ✅ **Files are private** (stored in your AWS S3 bucket)
- ✅ **Existing features unchanged** (all original functionality intact)

---

## **Troubleshooting**

### **"Sign In Failed" or "Invalid Credentials"**
- ✅ Check email spelling (case-insensitive is OK)
- ✅ Verify password exactly as shown above
- ✅ Make sure CAPS LOCK is off
- ✅ Refresh page and try again

### **"Can't Download File"**
- ✅ Must be **signed in** for direct downloads
- ✅ Or **copy the link** to share with others
- ✅ Link must not be expired (>24 hours old)

### **Upload Still Works Without Sign In?**
- ✅ **This is correct!** Guest uploads are fully enabled
- ✅ Sign in to access download features

---

## **What's Working** ✅

- ✅ Guest file uploads (no authentication required)
- ✅ Authenticated user uploads (with sign-in)
- ✅ Online file links display
- ✅ Copy links for sharing
- ✅ View recently uploaded files
- ✅ AWS S3 secure storage
- ✅ Signed URL auto-expiration
- ✅ Swift responsive UI
- ✅ Proper error handling

---

## **Next Steps**

1. **Try uploading** a test image or video
2. **Sign in** with one of the test accounts
3. **Upload another file** while authenticated
4. **Download** using the links (authenticated only)
5. **Share links** with others who can view files

---

## **Production Warning** 🚀

For **production deployment**:

1. ❌ **Do NOT use these test credentials**
2. ❌ **Do NOT commit TEST_CREDENTIALS.txt** (already .gitignored)
3. ✅ Create real user accounts through your app signup
4. ✅ Implement proper password reset functionality
5. ✅ Enable MFA (Multi-Factor Authentication)
6. ✅ Set up automated backups

---

**Happy Testing! 🎉**

For more info: Visit [AWS Amplify Docs](https://docs.amplify.aws/auth/overview/)

Need help? Check TEST_CREDENTIALS.txt for a quick reference.
