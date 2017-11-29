var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;

var secrets = require('./secrets.json');

var oauth2Client = new OAuth2(
    secrets.web.client_id,
    secrets.web.client_secret,
    secrets.web.redirect_uris[0]
);
var scopes = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.appdata',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/drive.metadata',
    'https://www.googleapis.com/auth/drive.metadata.readonly',
    'https://www.googleapis.com/auth/drive.photos.readonly',
    'https://www.googleapis.com/auth/drive.readonly'
];

var url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
});

module.exports = {
    oAuth2Client: oauth2Client,
    url: url
};