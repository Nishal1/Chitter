const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const CLIENT_ID = process.env.CLIENT_ID;
const CLEINT_SECRET = process.env.CLEINT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLEINT_SECRET,
    REDIRECT_URI
  );
  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

module.exports.sendMail= async (user) => {
    try {
      const accessToken = await oAuth2Client.getAccessToken();
  
      const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: 'nishalwebdev@gmail.com',
          clientId: CLIENT_ID,
          clientSecret: CLEINT_SECRET,
          refreshToken: REFRESH_TOKEN,
          accessToken: accessToken,
        },
      });
  
      const mailOptions = {
        from: 'Chitter group <nishalwebdev@gmail.com>',
        to: `${user.email}`,
        subject: 'Thank you for signing up to Chitter',
        text: 'Hi '+user.FirstName+ ', '
        +'\n\n'+
        'Thank you for signing up with Chitter.\n'+
        'This is a welcome email to get you started with Chitter.\n'+
        'Your credentials: \n'+
        '\t username: '+ user.username + '\n' +
        '\t First Name: '+ user.FirstName + '\n'+
        '\t Last Name: '+ user.LastName + '\n'+
        'Have Fun and keep chittering!!!\n \n'+
        'Warm Regards,\n'+
        'Chitter Group',
        
      };
  
      const result = await transport.sendMail(mailOptions);
      return result;
    } catch (error) {
      return error;
    }
  }