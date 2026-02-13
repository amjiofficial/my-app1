import React from 'react'
import ReactDOM from 'react-dom/client'
import { Amplify } from 'aws-amplify'
import awsExports from './aws-exports'
import App from './App'
import './index.css'

// Get bucket configuration - this is the S3 bucket where files will be stored
const bucketName = awsExports.aws_storage_s3_bucket || 'jan-media-dev-2026'
const region = awsExports.aws_storage_s3_region || awsExports.aws_project_region || 'us-east-1'

// Configure Amplify with Storage for Amplify v6
// For Amplify v6 with Gen 1 backend, Storage needs the bucket configured with the resource name
// The resource name "mediaStorage" matches the backend storage resource
const amplifyConfig: any = {
  ...awsExports,
  Storage: {
    S3: {
      bucket: bucketName,
      region: region,
    },
  },
  // For Gen 1 backend, add resources format with the storage resource name
  // This ensures uploadData can find and use the bucket
  resources: {
    storage: {
      mediaStorage: {
        bucketName: bucketName,
        region: region,
      },
    },
  },
}

// Configure Amplify
Amplify.configure(amplifyConfig)

// Verify Storage configuration - this ensures files will be stored in the bucket
const config: any = Amplify.getConfig()
console.log('✅ Storage configured for bucket:', {
  bucketName: bucketName,
  region: region,
  storageConfigured: !!config.Storage?.S3?.bucket,
  bucketFromConfig: config.Storage?.S3?.bucket,
  resourcesConfigured: !!config.resources?.storage?.mediaStorage,
  willStoreInBucket: bucketName,
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
