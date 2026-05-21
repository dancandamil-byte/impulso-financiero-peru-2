# Impulso Financiero Bot - Setup Guide

## Prerequisites
- Node.js 18+ installed
- npm or pnpm package manager
- Google account with access to Google Cloud Console
- WhatsApp installed on a phone

## 1. Google Sheets Setup

### Create the Spreadsheet
1. Go to [Google Sheets](https://docs.google.com/spreadsheets)
2. Click "New" → "Blank spreadsheet"
3. Name it "Impulso Financiero - Solicitudes"
4. Copy the spreadsheet ID from the URL:
   - URL format: `https://docs.google.com/spreadsheets/d/{ID}/edit`
   - Copy the `{ID}` part

### Update Environment Variables
1. Open `.env` file
2. Paste the spreadsheet ID into `GOOGLE_SPREADSHEET_ID`

## 2. Google Cloud Setup

### Create a Service Account
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable Google Sheets API:
   - Search for "Google Sheets API"
   - Click "Enable"
4. Create a Service Account:
   - Go to "Service Accounts" (under APIs & Services)
   - Click "Create Service Account"
   - Fill in service account name: `impulso-financiero-bot`
   - Click "Create and Continue"
5. Create a JSON Key:
   - In the service account, click the "Keys" tab
   - Click "Add Key" → "Create new key"
   - Choose "JSON"
   - Save the file as `credentials.json` in the project root

### Share the Spreadsheet
1. Open your Google Sheet
2. Click "Share" (top right)
3. Add the service account email (from credentials.json: `client_email` field)
4. Give it "Editor" access
5. Click "Share"

## 3. Install Dependencies

```bash
pnpm install
```

Or with npm:
```bash
npm install
```

## 4. Run the Bot

### Development Mode
```bash
pnpm dev
```

This will:
- Start the Express server on `http://localhost:3000`
- Initialize the WhatsApp bot and display a QR code in the terminal

### Scan QR Code
1. Open WhatsApp on your phone
2. Go to Settings → Linked Devices
3. Click "Link a Device"
4. Scan the QR code displayed in the terminal

### Verify Bot Connection
- Check terminal for: `✅ ¡Bot conectado! Listo para recibir mensajes`
- Visit `http://localhost:3000/api/bot/status` to verify bot status

## 5. Test the Bot

### Via WhatsApp
1. Add the bot's phone number as a contact
2. Send a message (any text)
3. Bot should respond with welcome message
4. Follow the conversation flow to test loan application

### Via Admin Dashboard
1. Go to `http://localhost:3000/admin`
2. View submitted loan applications
3. Approve or reject applications (updates in Google Sheets)

## 6. Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `GOOGLE_SPREADSHEET_ID` | Google Sheet ID from URL | `1a2b3c4d5e6f7g8h9i0j` |
| `GOOGLE_CREDENTIALS_PATH` | Path to credentials.json | `./credentials.json` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment mode | `development` or `production` |

## 7. Troubleshooting

### "GOOGLE_SPREADSHEET_ID no configurado"
- Make sure `.env` file exists with `GOOGLE_SPREADSHEET_ID` set
- Restart the server after updating `.env`

### "Error: credentials.json not found"
- Download credentials.json from Google Cloud Console
- Place it in the project root directory
- Ensure path in `.env` matches

### Bot not responding to messages
- Check terminal for connection status
- Scan QR code again if bot disconnected
- Verify phone number is active and has WhatsApp

### Data not saving to Google Sheets
- Verify the service account email has Editor access to the spreadsheet
- Check Google Sheets API is enabled in Google Cloud Console
- Look for errors in the terminal logs

## 8. File Structure

```
impulso-financiero-peru-2/
├── server/
│   ├── index.ts                    # Main server file
│   ├── services/
│   │   ├── whatsappBot.ts         # Bot logic
│   │   ├── googleSheets.ts        # Google Sheets integration
│   │   └── conversationManager.ts # Conversation state
│   └── ...
├── client/
│   ├── src/
│   │   └── pages/
│   │       └── Admin.tsx          # Admin dashboard
│   └── ...
├── shared/
│   └── types.ts                    # TypeScript types
├── .env                            # Environment variables (DO NOT COMMIT)
├── .env.example                    # Template for .env
├── credentials.json                # Google credentials (DO NOT COMMIT)
└── ...
```

## 9. Security Notes

⚠️ **Important:**
- Never commit `.env` or `credentials.json` to version control
- Both files are in `.gitignore`
- Keep `credentials.json` secure - it has API access to your Google Sheets
- Only share spreadsheet with trusted people

## 10. Next Steps

1. Test the complete flow end-to-end
2. Monitor Google Sheets for incoming applications
3. Review applications in the Admin dashboard
4. Customize bot messages if needed
5. Deploy to production server when ready

For issues or questions, check the terminal logs for detailed error messages.
