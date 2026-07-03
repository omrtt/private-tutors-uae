const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const axios = require('axios');

const UAEPASS_URLS = {
  sandbox: {
    authorize: 'https://stg-accounts.uaepass.ae/authorize',
    token: 'https://stg-accounts.uaepass.ae/oidc/token',
    userinfo: 'https://stg-accounts.uaepass.ae/oidc/userinfo',
  },
  production: {
    authorize: 'https://id.uaepass.ae/authorize',
    token: 'https://id.uaepass.ae/oidc/token',
    userinfo: 'https://id.uaepass.ae/oidc/userinfo',
  },
};

function getEnv(key, fallback) {
  return process.env[key] || fallback;
}

function getUrls() {
  const env = getEnv('UAE_PASS_ENV', 'sandbox');
  return UAEPASS_URLS[env] || UAEPASS_URLS.sandbox;
}

function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '30d' });
}

exports.login = (req, res) => {
  const clientId = getEnv('UAE_PASS_CLIENT_ID');
  const redirectUri = getEnv('UAE_PASS_REDIRECT_URI', `${req.protocol}://${req.get('host')}/api/auth/uaepass/callback`);
  const scope = getEnv('UAE_PASS_SCOPE', 'urn:uae:digitalid:profile:general');
  const state = crypto.randomBytes(16).toString('hex');
  const urls = getUrls();

  const authUrl = `${urls.authorize}?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}&acr_values=urn:safelayer:tokenservice:oidc:password`;
  res.redirect(authUrl);
};

exports.callback = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.redirect(`/login?error=missing_code`);
    }

    const clientId = getEnv('UAE_PASS_CLIENT_ID');
    const clientSecret = getEnv('UAE_PASS_CLIENT_SECRET');
    const redirectUri = getEnv('UAE_PASS_REDIRECT_URI', `${req.protocol}://${req.get('host')}/api/auth/uaepass/callback`);
    const urls = getUrls();

    const tokenRes = await axios.post(urls.token,
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }).toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const accessToken = tokenRes.data.access_token;
    if (!accessToken) {
      return res.redirect(`/login?error=token_exchange_failed`);
    }

    const userRes = await axios.get(urls.userinfo, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const uaeUser = userRes.data;
    const email = uaeUser.email || `${uaeUser.sub}@uaepass.ae`;
    const name = uaeUser.fullnameEN || uaeUser.fullnameAR || uaeUser.name || 'UAE Pass User';
    const phone = uaeUser.mobile || '';

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        password: crypto.randomBytes(16).toString('hex') + 'Aa1!',
        phone,
        role: 'student',
        isActive: true,
      });
    }

    const token = generateToken(user._id);
    const frontendUrl = getEnv('FRONTEND_URL', `${req.protocol}://${req.get('host')}`);
    res.redirect(`${frontendUrl}/login?uaepass_token=${token}`);
  } catch (err) {
    const frontendUrl = getEnv('FRONTEND_URL', `${req.protocol}://${req.get('host')}`);
    res.redirect(`${frontendUrl}/login?error=uaepass_failed`);
  }
};
