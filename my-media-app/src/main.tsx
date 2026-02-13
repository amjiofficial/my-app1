import React from 'react'
import ReactDOM from 'react-dom/client'
import { Amplify } from 'aws-amplify'
import awsExports from './aws-exports'
import App from './App'
import './index.css'

// Get bucket configuration with fallbacks
const bucketName = awsExports.aws_storage_s3_bucket || 'jan-media-dev-2026'
const region = awsExports.aws_storage_s3_region || awsExports.aws_project_region || 'us-east-1'

// Configure Amplify with explicit Storage configuration for Amplify v6
// This format ensures Storage module can access the bucket name
const amplifyConfig = {
  ...awsExports,
  Storage: {
    S3: {
      bucket: bucketName,
      region: region,
    },
  },
}

Amplify.configure(amplifyConfig)

// Debug: Log configuration to verify
console.log('Amplify configured with Storage:', {
  bucket: bucketName,
  region: region,
  hasStorageConfig: !!amplifyConfig.Storage,
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
