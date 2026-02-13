import React from 'react'
import ReactDOM from 'react-dom/client'
import { Amplify } from 'aws-amplify'
import { configure } from '@aws-amplify/storage'
import awsExports from './aws-exports'
import App from './App'
import './index.css'

Amplify.configure(awsExports)

// Explicitly configure Storage for Amplify v6
if (awsExports.aws_storage_s3_bucket) {
  configure({
    S3: {
      bucket: awsExports.aws_storage_s3_bucket,
      region: awsExports.aws_storage_s3_region || awsExports.aws_project_region,
    },
  })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
