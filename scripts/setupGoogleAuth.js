/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const path = require('path');

const credentialsBase64 = process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64;
const credentialsPath = path.resolve(__dirname, '../service-account.json');

const existingGoogleCredentialsEnvironmentVariable = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (existingGoogleCredentialsEnvironmentVariable) {
  console.log(
    '✅ Google Cloud credentials already set in environment variable:',
    existingGoogleCredentialsEnvironmentVariable,
  );
  return;
}

if (!credentialsBase64) {
  throw new Error('GOOGLE_APPLICATION_CREDENTIALS_BASE64 is not set');
}

if (credentialsBase64) {
  const decodedCredentials = Buffer.from(credentialsBase64, 'base64').toString('utf-8');

  fs.writeFileSync(credentialsPath, decodedCredentials);
  process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;

  console.log('✅ Google Cloud credentials created at build time:', credentialsPath);
} else {
  console.warn('⚠️ GOOGLE_APPLICATION_CREDENTIALS_BASE64 is not set. Skipping credentials setup.');
}
