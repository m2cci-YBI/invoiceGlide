export const authConfig = {
    issuer: 'https://accounts.google.com',
    redirectUri: window.location.origin + '/settings/mail-settings',
    // IMPORTANT: Replace 'YOUR_CLIENT_ID' with your actual Google OAuth 2.0 Client ID
    clientId: 'YOUR_CLIENT_ID',
    scope: 'openid profile email',
    responseType: 'code',
    strictDiscoveryDocumentValidation: false
};
//# sourceMappingURL=auth.config.js.map