const cors = require('cors');
const express = require('express');
const { google } = require('googleapis');
const db = require("../db-setup/connection");
require('dotenv').config();

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
   
  }));

app.use(express.json());

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
);
  
const scopes = [
'https://www.googleapis.com/auth/calendar', 
'https://www.googleapis.com/auth/userinfo.profile',
'https://www.googleapis.com/auth/userinfo.email'
];

app.get('/auth/google', (req, res) => {
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes
    });
    res.redirect(url);
});
  
app.get('/redirect', async (req, res) => {
    const code = req.query.code;
    if (!code) return res.status(400).send("Missing code");
  
    try {
   
      const { tokens } = await oauth2Client.getToken(code);
  
      oauth2Client.setCredentials(tokens);
  
      const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
      const userInfo = await oauth2.userinfo.get();
      const { email, name, id: googleId, picture } = userInfo.data;
  
      let userResult = await db.query(
        `SELECT user_id FROM users WHERE google_id = $1`,
        [googleId]
      );
  
      let userId;
      if (userResult.rows.length > 0) {
        userId = userResult.rows[0].user_id;
      } else {
        userResult = await db.query(
          `INSERT INTO users (google_id, email, name, picture, role)
           VALUES ($1, $2, $3, $4, 'user')
           RETURNING user_id`,
          [googleId, email, name, picture]
        );
        userId = userResult.rows[0].user_id;
      }
  
      const refreshToken = tokens.refresh_token || null;
      const accessToken = tokens.access_token;
      const expiryDate = tokens.expiry_date ? new Date(tokens.expiry_date) : null;
  

      await db.query(
        `INSERT INTO oauth_tokens (user_id, access_token, refresh_token, expiry_date)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (user_id) DO UPDATE SET
           access_token = EXCLUDED.access_token,
           refresh_token = COALESCE(EXCLUDED.refresh_token, oauth_tokens.refresh_token),
           expiry_date = EXCLUDED.expiry_date`,
        [userId, accessToken, refreshToken, expiryDate]
      );
  
  
      res.redirect('http://localhost:5173/');
    } catch (error) {
      console.error("❌ Error during login:", error.response?.data || error.message || error);
      res.status(500).send("Login failed");
    }
  });
  
module.exports = { app };