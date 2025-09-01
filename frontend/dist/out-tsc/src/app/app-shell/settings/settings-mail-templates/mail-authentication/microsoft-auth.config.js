export const microsoftAuthConfig = {
    issuer: 'https://login.microsoftonline.com/common/v2.0',
    redirectUri: window.location.origin + '/settings/mail-settings',
    // IMPORTANT: Replace 'YOUR_MICROSOFT_CLIENT_ID' with your actual Microsoft Azure Application (client) ID
    clientId: 'YOUR_MICROSOFT_CLIENT_ID',
    scope: 'openid profile email User.Read',
    responseType: 'code',
    strictDiscoveryDocumentValidation: false,
    skipIssuerCheck: true
};
//# sourceMappingURL=microsoft-auth.config.js.map