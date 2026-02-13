import { useState, useEffect } from "react"
import { uploadData, getUrl, list } from "@aws-amplify/storage"
import { signIn, fetchAuthSession, signOut as amplifySignOut } from "@aws-amplify/auth"
import awsExports from "./aws-exports"

function App() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [files, setFiles] = useState<Array<any>>([])
  const [loadingFiles, setLoadingFiles] = useState(false)
  const [uploadedFilesList, setUploadedFilesList] = useState<Array<{ path: string; url: string; name: string; timestamp: number }>>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)


  const fetchFiles = async () => {
    // Only attempt list() when authenticated to avoid noisy AccessDenied errors
    if (!isAuthenticated) {
      setFiles([])
      return
    }
    setLoadingFiles(true)
    try {
      let items: any[] = []

      // Try listing from public/uploads/ (guest uploads)
      try {
        const publicRes: any = await list({ path: "public/uploads/" })
        if (Array.isArray(publicRes)) items = publicRes
        else if (Array.isArray(publicRes?.results)) items = publicRes.results
        else if (Array.isArray(publicRes?.items)) items = publicRes.items
      } catch (e) {
        // suppress noisy permission errors for guests
        console.debug("public/uploads/ not accessible or not present")
      }

      // Also try listing from uploads/ (direct path)
      if (items.length === 0) {
        try {
          const res: any = await list({ path: "uploads/" })
          if (Array.isArray(res)) items = res
          else if (Array.isArray(res?.results)) items = res.results
          else if (Array.isArray(res?.items)) items = res.items
        } catch (e) {
          console.debug("uploads/ not accessible or not present")
        }
      }

      // Also try private/uploads/ (authenticated user uploads)
      if (items.length === 0) {
        try {
          const privateRes: any = await list({ path: "private/uploads/" })
          if (Array.isArray(privateRes)) items = [...items, ...privateRes]
          else if (Array.isArray(privateRes?.results)) items = [...items, ...privateRes.results]
          else if (Array.isArray(privateRes?.items)) items = [...items, ...privateRes.items]
        } catch (e) {
          console.debug("private/uploads/ not accessible or not present")
        }
      }

      // map to include url
      const mapped = await Promise.all(
        items.map(async (it: any) => {
          const key = it?.key ?? it?.path ?? it
          let url: string | null = null
          try {
            const urlRes: any = await getUrl({ path: key })
            url = urlRes?.url?.toString() ?? null
          } catch (e) {
            console.debug("getUrl failed for", key)
            url = null
          }
          return { key, size: it?.size, lastModified: it?.lastModified, url }
        })
      )

      setFiles(mapped)
    } catch (e) {
      console.error("list error:", e)
      setFiles([])
    } finally {
      setLoadingFiles(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    try {
      setUploading(true)

      const uploadPath = `uploads/${Date.now()}-${file.name}`
      console.log("Uploading to path:", uploadPath)

      // Get bucket name from config
      const bucketName = awsExports.aws_storage_s3_bucket || 'jan-media-dev-2026'
      
      // Use uploadData with explicit bucket configuration
      const result = await uploadData({
        path: uploadPath,
        data: file,
        options: {
          bucket: bucketName,
        },
      }).result

      console.log("Upload result:", result)
      console.log("File stored at:", result.path)

      const urlResult = await getUrl({
        path: result.path,
      })

      setFileUrl(urlResult.url.toString())

      // Add to uploaded files list for easy access and persist to localStorage
      const fileName = file?.name || "unknown"
      const newEntry = {
        path: result.path,
        url: urlResult.url.toString(),
        name: fileName,
        timestamp: Date.now(),
      }
      setUploadedFilesList((prev) => {
        const next = [...prev, newEntry]
        try {
          localStorage.setItem("uploadedFilesList", JSON.stringify(next))
        } catch (e) {
          /* ignore */
        }
        return next
      })

      alert("Upload successful!")
      // Try to refresh file list after successful upload (silently fail if no ListBucket permission)
      fetchFiles().catch(() => {
        /* silently ignore list errors */
      })
    } catch (error) {
      console.error("Upload error:", error)

      // Handle Cognito unauthenticated identity error by prompting sign-in or guest mode
      const message = (error as any)?.message || String(error)
      if (message.includes("Unauthenticated") || message.includes("NotAuthorizedException")) {
        // offer choice: sign in with email/password or use guest mode
        setShowAuthChoice(true)
      } else {
        alert("Upload failed")
      }
    } finally {
      setUploading(false)
    }
  }

  const [showSignIn, setShowSignIn] = useState(false)
  const [showAuthChoice, setShowAuthChoice] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [signingIn, setSigningIn] = useState(false)
  const [guestMode, setGuestMode] = useState(false)
  
  useEffect(() => {
    // restore uploaded files list from localStorage to avoid needing S3 list()
    try {
      const raw = localStorage.getItem("uploadedFilesList")
      if (raw) {
        setUploadedFilesList(JSON.parse(raw))
      }
    } catch (e) {
      // ignore parse errors
    }
  }, [])

  useEffect(() => {
    // Check auth session on mount so the UI knows if the user is signed in
    let mounted = true
    ;(async () => {
      try {
        await fetchAuthSession()
        if (mounted) setIsAuthenticated(true)
      } catch (e) {
        if (mounted) setIsAuthenticated(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const handleSignIn = async () => {
    try {
      setSigningIn(true)
      // Basic validation to avoid EmptySignInUsername
      if (!email || !email.trim()) {
        alert("Please enter your email (username).")
        return
      }
      if (!password) {
        alert("Please enter your password.")
        return
      }

      // call signIn with an explicit username field to match Amplify v6 signatures
      await signIn({ username: email.trim(), password })

      // Ensure auth session & credentials are fetched before retrying upload
      try {
        await fetchAuthSession()
      } catch (e) {
        // non-fatal — proceed to retry upload anyway
        console.warn("fetchAuthSession failed:", e)
      }

      // After successful sign-in, set authenticated flag and retry upload automatically
      setIsAuthenticated(true)
      setShowAuthChoice(false)
      setShowSignIn(false)
      await handleUpload()
    } catch (err) {
      console.error("Sign in error:", err)
      alert("Sign in failed: " + ((err as any)?.message || String(err)))
    } finally {
      setSigningIn(false)
    }
  }

  const handleGuestUpload = async () => {
    // bypass auth requirement and retry the same upload
    setGuestMode(true)
    setShowAuthChoice(false)
    await handleUpload()
  }

  useEffect(() => {
    // Don't list files on mount (causes 403 errors)
    // Files are displayed after each successful upload
  }, [])

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f7fa", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", padding: "40px 0", boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ textAlign: "center", flex: 1 }}>
            <h1 style={{ margin: 0, fontSize: "32px", fontWeight: "700", letterSpacing: "1px" }}>📤 Media Upload App</h1>
            <p style={{ margin: "10px 0 0 0", opacity: 0.95, fontSize: "15px", fontWeight: "300" }}>Secure cloud storage powered by AWS</p>
          </div>
          {isAuthenticated ? (
            <button
              onClick={async () => {
                try {
                  await amplifySignOut()
                } catch (e) {
                  // ignore
                }
                setIsAuthenticated(false)
                alert("Signed out")
              }}
              style={{
                padding: "12px 24px",
                backgroundColor: "rgba(255,255,255,0.15)",
                color: "white",
                border: "2px dashed rgba(255,255,255,0.4)",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                transition: "all 0.3s ease",
                fontSize: "14px",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.25)"
                e.currentTarget.style.transform = "scale(1.05)"
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.15)"
                e.currentTarget.style.transform = "scale(1)"
              }}
            >
              Sign out
            </button>
          ) : null}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, maxWidth: "1000px", margin: "0 auto", padding: "40px 20px", width: "100%" }}>
        {/* Upload Card */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "40px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
          marginBottom: "30px",
          border: "2px dashed #667eea",
          textAlign: "center",
        }}>
          <h2 style={{ margin: "0 0 30px 0", color: "#2c3e50", fontSize: "26px", fontWeight: "700" }}>Upload Your Media</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" }}>
            <div style={{ width: "100%", maxWidth: "500px" }}>
              <label style={{ display: "block", marginBottom: "15px", color: "#555", fontWeight: "600", fontSize: "15px" }}>
                Select Image or Video
              </label>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                style={{
                  width: "100%",
                  padding: "20px",
                  border: "3px dashed #667eea",
                  borderRadius: "10px",
                  backgroundColor: "#f8f9ff",
                  cursor: "pointer",
                  fontSize: "14px",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#f0f2ff"
                  e.currentTarget.style.borderColor = "#764ba2"
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#f8f9ff"
                  e.currentTarget.style.borderColor = "#667eea"
                }}
              />
              {file && <p style={{ margin: "12px 0 0 0", color: "#667eea", fontSize: "14px", fontWeight: "600" }}>✅ {file.name}</p>}
            </div>

            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              style={{
                padding: "16px 40px",
                backgroundColor: !file || uploading ? "#ccc" : "#667eea",
                color: "white",
                border: "2px dashed #667eea",
                borderRadius: "10px",
                cursor: !file || uploading ? "not-allowed" : "pointer",
                fontWeight: "700",
                fontSize: "16px",
                transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                opacity: !file || uploading ? 0.6 : 1,
                transform: "scale(1)",
              }}
              onMouseOver={(e) => {
                if (!(!file || uploading)) {
                  e.currentTarget.style.backgroundColor = "#764ba2"
                  e.currentTarget.style.transform = "scale(1.08) translateY(-4px)"
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(102, 126, 234, 0.5)"
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#667eea"
                e.currentTarget.style.transform = "scale(1)"
              }}
            >
              {uploading ? "⏳ Uploading..." : "🚀 Upload"}
            </button>
          </div>
        </div>

      {/* Auth Modals */}
      {showSignIn && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}>
          <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "30px", width: "100%", maxWidth: "400px", boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}>
            <h3 style={{ margin: "0 0 24px 0", color: "#2c3e50", fontSize: "20px" }}>Sign In to Your Account</h3>
            <input
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                display: "block",
                width: "100%",
                marginBottom: "15px",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            />
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                display: "block",
                width: "100%",
                marginBottom: "20px",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            />
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={handleSignIn}
                disabled={signingIn}
                style={{
                  flex: 1,
                  padding: "12px",
                  backgroundColor: "#667eea",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: signingIn ? "not-allowed" : "pointer",
                  fontWeight: "600",
                  opacity: signingIn ? 0.6 : 1,
                }}
              >
                {signingIn ? "Signing in..." : "Sign In"}
              </button>
              <button
                onClick={() => setShowSignIn(false)}
                disabled={signingIn}
                style={{
                  flex: 1,
                  padding: "12px",
                  backgroundColor: "#e0e0e0",
                  color: "#333",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showAuthChoice && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}>
          <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "30px", width: "100%", maxWidth: "450px", boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}>
            <h3 style={{ margin: "0 0 12px 0", color: "#2c3e50", fontSize: "20px" }}>Authentication Required</h3>
            <p style={{ margin: "0 0 24px 0", color: "#666", fontSize: "14px" }}>Would you like to sign in or continue as a guest?</p>
            <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
              <button
                onClick={() => {
                  setShowAuthChoice(false)
                  setShowSignIn(true)
                }}
                style={{
                  padding: "12px",
                  backgroundColor: "#667eea",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "15px",
                }}
              >
                🔐 Sign In with Email
              </button>
              <button
                onClick={handleGuestUpload}
                style={{
                  padding: "12px",
                  backgroundColor: "#f0f0f0",
                  color: "#333",
                  border: "2px solid #667eea",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "15px",
                }}
              >
                👤 Upload as Guest
              </button>
              <button
                onClick={() => setShowAuthChoice(false)}
                style={{
                  padding: "12px",
                  backgroundColor: "#e0e0e0",
                  color: "#333",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "15px",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Uploaded Files Section */}
      <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "30px", boxShadow: "0 2px 16px rgba(0,0,0,0.08)", marginBottom: "30px" }}>
        <h2 style={{ margin: "0 0 24px 0", color: "#2c3e50", fontSize: "22px", fontWeight: "600" }}>📋 Your Uploaded Files</h2>

        {uploadedFilesList.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", backgroundColor: "#f8f9ff", borderRadius: "8px" }}>
            <p style={{ color: "#999", fontSize: "16px", margin: 0 }}>📁 No files uploaded yet. Upload an image or video above to get started!</p>
          </div>
        ) : (
          <>
            {!isAuthenticated && (
              <div style={{ backgroundColor: "#fff3cd", padding: "15px", borderRadius: "8px", marginBottom: "20px", border: "1px solid #ffc107", display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "18px", marginTop: "2px" }}>ℹ️</span>
                <div>
                  <strong style={{ color: "#856404", display: "block", marginBottom: "4px" }}>Tip: Sign in for full access</strong>
                  <span style={{ color: "#856404", fontSize: "13px" }}>Sign in to your account to download files directly. Or share the copy links with others.</span>
                </div>
              </div>
            )}

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#667eea", color: "white" }}>
                    <th style={{ padding: "14px", textAlign: "left", border: "none", fontWeight: "600" }}>File Name</th>
                    <th style={{ padding: "14px", textAlign: "left", border: "none", fontWeight: "600" }}>Online Link</th>
                    <th style={{ padding: "14px", textAlign: "center", border: "none", fontWeight: "600" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {uploadedFilesList.map((f, idx) => (
                    <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f8f9ff", borderBottom: "1px solid #e0e0e0" }}>
                      <td style={{ padding: "14px" }}>
                        <strong style={{ color: "#2c3e50" }}>{f.name}</strong>
                        <div style={{ fontSize: "12px", color: "#999", marginTop: "6px" }}>
                          {new Date(f.timestamp).toLocaleString()}
                        </div>
                      </td>
                      <td style={{ padding: "14px" }}>
                        {f.url ? (
                          <a
                            href={f.url}
                            onClick={(e) => {
                              e.preventDefault()
                              if (isAuthenticated) {
                                getUrl({ path: f.path })
                                  .then((fresh) => {
                                    const url = fresh?.url?.toString()
                                    if (url) {
                                      window.open(url, "_blank")
                                    }
                                  })
                                  .catch(() => {
                                    alert("Could not generate download link. Please sign in.")
                                  })
                              } else {
                                const ok = window.confirm(
                                  "This file may require signing in to download. Open anyway?"
                                )
                                if (ok) window.open(f.url, "_blank")
                              }
                            }}
                            rel="noreferrer"
                            style={{
                              color: "#667eea",
                              textDecoration: "none",
                              wordBreak: "break-all",
                              fontSize: "13px",
                              display: "inline-block",
                              maxWidth: "100%",
                            }}
                          >
                            {f.url.length > 50 ? `${f.url.substring(0, 40)}...` : f.url}
                          </a>
                        ) : (
                          <code style={{ backgroundColor: "#f5f5f5", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", color: "#999" }}>-</code>
                        )}
                      </td>
                      <td style={{ padding: "14px", textAlign: "center" }}>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
                          {isAuthenticated ? (
                            <>
                              <a
                                href={f.url}
                                target="_blank"
                                rel="noreferrer"
                                download
                                style={{
                                  display: "inline-block",
                                  padding: "6px 14px",
                                  backgroundColor: "#2196F3",
                                  color: "white",
                                  textDecoration: "none",
                                  borderRadius: "6px",
                                  fontSize: "13px",
                                  fontWeight: "500",
                                  cursor: "pointer",
                                  transition: "all 0.3s ease",
                                }}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.backgroundColor = "#1976D2"
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.backgroundColor = "#2196F3"
                                }}
                              >
                                📥 Download
                              </a>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(f.url)
                                  alert("✅ Link copied!")
                                }}
                                style={{
                                  padding: "6px 14px",
                                  backgroundColor: "#ff9800",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "6px",
                                  fontSize: "13px",
                                  fontWeight: "500",
                                  cursor: "pointer",
                                  transition: "all 0.3s ease",
                                }}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.backgroundColor = "#f57c00"
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.backgroundColor = "#ff9800"
                                }}
                              >
                                📋 Copy
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  alert("📌 Sign in to download your files.")
                                }}
                                style={{
                                  padding: "6px 14px",
                                  backgroundColor: "#2196F3",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "6px",
                                  fontSize: "13px",
                                  fontWeight: "500",
                                  cursor: "pointer",
                                }}
                              >
                                ⓘ Info
                              </button>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(f.url)
                                  alert("✅ Link copied! Share with others.")
                                }}
                                style={{
                                  padding: "6px 14px",
                                  backgroundColor: "#ff9800",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "6px",
                                  fontSize: "13px",
                                  fontWeight: "500",
                                  cursor: "pointer",
                                }}
                              >
                                📋 Copy Link
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* File Browser Section */}
      <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "30px", boxShadow: "0 2px 16px rgba(0,0,0,0.08)", marginBottom: "30px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ margin: 0, color: "#2c3e50", fontSize: "22px", fontWeight: "600" }}>🗂️ Browse All Files</h2>
          <button
            onClick={() => fetchFiles()}
            disabled={loadingFiles}
            style={{
              padding: "10px 20px",
              backgroundColor: "#667eea",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: loadingFiles ? "not-allowed" : "pointer",
              fontWeight: "600",
              opacity: loadingFiles ? 0.6 : 1,
            }}
          >
            {loadingFiles ? "⏳ Loading..." : "🔄 Refresh"}
          </button>
        </div>

        {loadingFiles ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#999" }}>Loading files...</div>
        ) : files.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", backgroundColor: "#f8f9ff", borderRadius: "8px", color: "#999" }}>
            No files found in storage
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" }}>
            {files.map((f) => (
              <div
                key={f.key}
                style={{
                  backgroundColor: "#f8f9ff",
                  borderRadius: "8px",
                  padding: "15px",
                  border: "1px solid #e0e0e0",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                {f.url && f.url.endsWith(".mp4") ? (
                  <video src={f.url} style={{ maxWidth: "100%", maxHeight: "140px", borderRadius: "6px", marginBottom: "10px" }} />
                ) : f.url && (f.url.endsWith(".jpg") || f.url.endsWith(".png") || f.url.includes("image/")) ? (
                  <img src={f.url} alt={f.key} style={{ maxWidth: "100%", maxHeight: "140px", borderRadius: "6px", marginBottom: "10px" }} />
                ) : (
                  <div style={{ width: "100%", height: "140px", backgroundColor: "#e0e0e0", borderRadius: "6px", marginBottom: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>
                    📄
                  </div>
                )}
                <strong style={{ fontSize: "13px", color: "#2c3e50", marginBottom: "6px", wordBreak: "break-word" }}>{f.key}</strong>
                {f.size && <span style={{ fontSize: "12px", color: "#999", marginBottom: "10px" }}>{Math.round(f.size / 1024)} KB</span>}
                {f.url && (
                  <a
                    href={f.url}
                    target="_blank"
                    rel="noreferrer"
                    download
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "#667eea",
                      color: "white",
                      textDecoration: "none",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: "600",
                    }}
                  >
                    📥 Download
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Section */}
      {fileUrl && (
        <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "30px", boxShadow: "0 2px 16px rgba(0,0,0,0.08)" }}>
          <h2 style={{ margin: "0 0 24px 0", color: "#2c3e50", fontSize: "22px", fontWeight: "600" }}>✅ Upload Preview</h2>
          <div style={{ backgroundColor: "#f8f9ff", padding: "20px", borderRadius: "8px", display: "flex", justifyContent: "center" }}>
            {file?.type.startsWith("image") ? (
              <img src={fileUrl} alt="uploaded" style={{ maxWidth: "100%", maxHeight: "500px", borderRadius: "8px" }} />
            ) : (
              <video src={fileUrl} controls style={{ maxWidth: "100%", maxHeight: "500px", borderRadius: "8px" }} />
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: "40px", paddingTop: "20px", borderTop: "1px solid #e0e0e0", textAlign: "center", color: "#999", fontSize: "13px" }}>
        <p>Powered by AWS Amplify, S3, and Cognito</p>
      </div>
      </div>
    </div>
  )
}

export default App
