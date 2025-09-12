export * from './auth'
export * from './need'
export * from './donation'
export * from './payment'
export * from './file'

// NOTE: Each endpoint string is appended to process.env.NEXT_PUBLIC_API_BASE which should end with 'altruishare'
// Example: http://localhost:8000/api/method/altruishare + '.as_api.auth_api.login'