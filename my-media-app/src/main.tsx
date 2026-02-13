import React from 'react'
import ReactDOM from 'react-dom/client'
import { Amplify } from 'aws-amplify'
import awsExports from './aws-exports'
import App from './App'
import './index.css'

// Configure Amplify with Storage settings explicitly included
Amplify.configure({
  ...awsExports,
  Storage: {
    S3: {
      bucket: awsExports.aws_storage_s3_bucket,
      region: awsExports.aws_storage_s3_region || awsExports.aws_project_region,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
