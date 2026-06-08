const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const CERT_DIR = path.join(__dirname, '..', 'certs');
const KEY_PATH = path.join(CERT_DIR, 'key.pem');
const CERT_PATH = path.join(CERT_DIR, 'cert.pem');

// Returns { key, cert } for local HTTPS, or null if a certificate could not be
// produced (the caller then falls back to plain HTTP so the app never breaks).
//
// The self-signed certificate is generated once with OpenSSL and cached in the
// certs/ folder (gitignored). Browsers show a one-time "not trusted" warning
// because it is self-signed — expected for local development.
function getCert() {
  try {
    if (!fs.existsSync(KEY_PATH) || !fs.existsSync(CERT_PATH)) {
      generateWithOpenSSL();
    }
    return {
      key: fs.readFileSync(KEY_PATH),
      cert: fs.readFileSync(CERT_PATH),
    };
  } catch (err) {
    console.error('HTTPS certificate unavailable, falling back to HTTP:', err.message);
    return null;
  }
}

function generateWithOpenSSL() {
  fs.mkdirSync(CERT_DIR, { recursive: true });
  // Generate a 2048-bit key and a self-signed certificate valid for 1 year,
  // with a Subject Alternative Name so modern browsers accept localhost.
  execFileSync('openssl', [
    'req', '-x509', '-newkey', 'rsa:2048', '-nodes',
    '-keyout', KEY_PATH, '-out', CERT_PATH,
    '-days', '365', '-subj', '/CN=localhost',
    '-addext', 'subjectAltName=DNS:localhost,IP:127.0.0.1',
  ], { stdio: 'ignore' });
}

module.exports = getCert;
