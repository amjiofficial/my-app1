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
// For Gen 1 backend, we need to use the resources format with the resource name
const amplifyConfig: any = {
  ...awsExports,
  Storage: {
    S3: {
      bucket: bucketName,
      region: region,
    },
  },
  // Add resources format for Gen 1 backend - this matches the backend resource name
  resources: {
    storage: {
      mediaStorage: {
        bucketName: bucketName,
        region: region,
      },
    },
  },
}

Amplify.configure(amplifyConfig)

// Debug: Log configuration to verify
console.log('Amplify configured with Storage:', {
  bucket: bucketName,
  region: region,
  storageConfig: amplifyConfig.Storage,
  resourcesConfig: amplifyConfig.resources?.storage?.mediaStorage,
  awsExportsBucket: awsExports.aws_storage_s3_bucket,
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
