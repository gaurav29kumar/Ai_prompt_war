import fs from 'fs';
import path from 'path';
export const generateLocalCert = () => {
  const certDir = path.resolve('server/certs');
  const keyPath = path.join(certDir, 'key.pem');
  const certPath = path.join(certDir, 'cert.pem');

  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    return {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath)
    };
  }

  if (!fs.existsSync(certDir)) {
    fs.mkdirSync(certDir, { recursive: true });
  }

  console.log('Generating local self-signed certificates for HTTPS...');
  // Note: Using a library like 'selfsigned' or OpenSSL is better for real dev tools,
  // but we are using node:crypto locally just for the TLS wrapper wrapper.
  // We'll mock returning undefined and letting the main file fallback to HTTP if no certs exist,
  // OR we can generate it using standard child_process but that requires openssl.
  // To ensure the dev can run this anywhere, we will gracefully fallback to http 
  // if generating a cert fails or we just return an empty object if we can't generate.
  
  // Due to node crypto limitations, we can't generate an x509 easily without a package like `node-forge`.
  // We will tell the user to use basic HTTP locally unless they provide certs, but we will wrap the logic.
  console.log('Skipping cert generation in pure node. Place key.pem and cert.pem in server/certs to enable HTTPS.');
  return null;
};
