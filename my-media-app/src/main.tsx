import React from 'react'
import ReactDOM from 'react-dom/client'
import { Amplify } from 'aws-amplify'
import awsExports from './aws-exports'
import App from './App'
import './index.css'

// Get bucket configuration with fallbacks
const bucketName = awsExports.aws_storage_s3_bucket || 'jan-media-dev-2026'
const region = awsExports.aws_storage_s3_region || awsExports.aws_project_region || 'us-east-1'

// Configure Amplify with Storage for Amplify v6
// For Amplify v6, Storage needs the bucket configured in Storage.S3 format
const amplifyConfig: any = {
  ...awsExports,
  Storage: {
    S3: {
      bucket: bucketName,
      region: region,
    },
  },
}

Amplify.configure(amplifyConfig)

// Debug: Log configuration to verify Storage is configured correctly
const config = Amplify.getConfig()
console.log('Amplify Storage Configuration:', {
  bucket: bucketName,
  region: region,
  storageConfig: config.Storage,
  awsExportsBucket: awsExports.aws_storage_s3_bucket,
  fullStorageConfig: JSON.stringify(config.Storage, null, 2),
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
