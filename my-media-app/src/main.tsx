import React from 'react'
import ReactDOM from 'react-dom/client'
import { Amplify } from 'aws-amplify'
import awsExports from './aws-exports'
import App from './App'
import './index.css'

// Configure Amplify with Storage resources for Amplify v6
Amplify.configure({
  ...awsExports,
  Storage: {
    S3: {
      bucket: awsExports.aws_storage_s3_bucket || 'jan-media-dev-2026',
      region: awsExports.aws_storage_s3_region || awsExports.aws_project_region || 'us-east-1',
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
