const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value:
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' https://js.stripe.com; " +
      "frame-src https://js.stripe.com https://hooks.stripe.com; " +
      "connect-src 'self' https://api.stripe.com; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data:;",
  },
  {
    key: 'X-Frame-Options',
    value: 'ALLOWALL',
  },
];

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};
