import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());
  
  // Session configuration for iframe context
  app.use(session({
    secret: 'bakecost-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true,
      sameSite: 'none',
      httpOnly: true,
    }
  }));

  // Google OAuth setup
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.APP_URL || 'http://localhost:3000'}/auth/google/callback`
  );

  // Auth URL
  app.get('/api/auth/google/url', (req, res) => {
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/userinfo.email'
      ],
    });
    res.json({ url });
  });

  // Auth Callback
  app.get('/auth/google/callback', async (req, res) => {
    const { code } = req.query;
    try {
      const { tokens } = await oauth2Client.getToken(code as string);
      // Store tokens in session (in a real app, store in DB)
      (req.session as any).tokens = tokens;
      
      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
            <p>Authentication successful. Window closing...</p>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('OAuth Error:', error);
      res.status(500).send('Authentication failed');
    }
  });

  // Create Google Sheet
  app.post('/api/export/sheets', async (req, res) => {
    const tokens = (req.session as any).tokens;
    if (!tokens) {
      return res.status(401).json({ error: 'Not authenticated with Google' });
    }

    const { recipe, costs } = req.body;
    oauth2Client.setCredentials(tokens);
    const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

    try {
      // Create a new spreadsheet
      const spreadsheet = await sheets.spreadsheets.create({
        requestBody: {
          properties: { title: `Bakery Report: ${recipe.name}` },
        },
      });

      const spreadsheetId = spreadsheet.data.spreadsheetId;

      // Prepare data
      const rows = [
        ['Recipe Label', recipe.name],
        ['Yield (PCS)', recipe.yield],
        ['Labor Cost', recipe.operationalCost],
        ['Packaging / Piece', recipe.packagingPerPc],
        ['', ''],
        ['Ingredient Name', 'Weight (gr)', 'Cost'],
        ...recipe.ingredients.map((item: any) => [
          item.name,
          item.weight,
          item.costPerGram * item.weight
        ]),
        ['', ''],
        ['Total Ingredient Cost', costs.totalIngredientCost],
        ['Total Batch Cost', costs.totalCost],
        ['COGS PER PIECE', costs.hppPerPc],
      ];

      // Write data
      await sheets.spreadsheets.values.update({
        spreadsheetId: spreadsheetId!,
        range: 'Sheet1!A1',
        valueInputOption: 'RAW',
        requestBody: { values: rows },
      });

      res.json({ url: spreadsheet.data.spreadsheetUrl, id: spreadsheetId });
    } catch (error) {
      console.error('Sheets Error:', error);
      res.status(500).json({ error: 'Failed to create spreadsheet' });
    }
  });

  // Send Email
  app.post('/api/export/email', async (req, res) => {
    const { to, subject, body, spreadsheetUrl } = req.body;

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({ error: 'Email service not configured' });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    try {
      await transporter.sendMail({
        from: `"Bakery Calculator" <${process.env.EMAIL_USER}>`,
        to,
        subject: subject || 'Bakery Recipe Calculation Report',
        text: `${body}\n\nGoogle Sheets Link: ${spreadsheetUrl}`,
        html: `<p>${body}</p><p><strong>Google Sheets Link:</strong> <a href="${spreadsheetUrl}">${spreadsheetUrl}</a></p>`,
      });
      res.json({ success: true });
    } catch (error) {
      console.error('Email Error:', error);
      res.status(500).json({ error: 'Failed to send email' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const root = path.join(__dirname, 'dist');
    app.use(express.static(root));
    app.get('*', (req, res) => {
      res.sendFile(path.join(root, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
