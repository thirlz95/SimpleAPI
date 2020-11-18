const oAuth = require('oauth'); 
const clientId = '9e1bc991-2bbb-4bce-a9c9-ca8293f4809f';
const secret = 'h+]XZ[faf[I6EE0yJ2yQ0ffQKP0.XaKK';
const callbackURL = 'http://localhost:3000/home'


oa = new oAuth(
    clientId,
    secret,
    callbackURL
)
