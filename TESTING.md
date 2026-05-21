# Bot Testing Guide

## Pre-Testing Checklist

- [ ] `.env` file created with `GOOGLE_SPREADSHEET_ID` filled in
- [ ] `credentials.json` downloaded from Google Cloud Console and placed in project root
- [ ] Service account email added as Editor to the Google Sheet
- [ ] Dependencies installed: `pnpm install`
- [ ] No compilation errors: `pnpm check`

## Running the Bot

### Terminal 1: Start the Server
```bash
pnpm dev
```

Expected output:
```
✓ Server running on http://localhost:3000/
✅ Google Sheets API inicializado correctamente
✓ Hoja "Solicitudes" creada con encabezados
```

### Terminal 2: Bot Connection (if not in same terminal)
Watch Terminal 1 for bot initialization. You should see:

```
🚀 Iniciando WhatsApp Bot...
🔗 QR Code generado, escanea para conectar:
[QR Code displayed in terminal]
```

## Test Scenarios

### Scenario 1: Complete Loan Application

**Goal:** Verify the full conversation flow and data saving

**Steps:**
1. On your phone: Open WhatsApp and go to "Linked Devices" or find the bot contact
2. Send any message (e.g., "Hola")
3. Bot responds with welcome message
4. Follow the conversation:
   - **Bot asks:** Nombre completo → **You:** Pedro García
   - **Bot asks:** DNI → **You:** 12345678
   - **Bot asks:** Teléfono → **You:** 987654321
   - **Bot asks:** Dirección → **You:** Calle Principal 123
   - **Bot asks:** Negocio → **You:** Vendo ropa en feria
   - **Bot asks:** Ingresos mensuales → **You:** 2000
   - **Bot asks:** Monto solicitado → **You:** 1500
5. Bot shows summary and asks "¿Es correcto?"
6. Send "SI" (or "Sí" or "S")

**Expected Result:**
- ✅ Bot confirms: "Tu solicitud fue registrada correctamente"
- ✅ Data appears in Google Sheets within seconds
- ✅ Admin dashboard shows new entry

### Scenario 2: Validation - Invalid Inputs

**Goal:** Verify input validation

**Test Cases:**

#### Invalid DNI (not 8 digits)
- Send: "12345" → Bot should reject
- Send: "123456789" → Bot should reject
- Expected: Error message about 8-digit requirement

#### Invalid Telephone
- Send: "123456" → Bot should reject
- Send: "9876" → Bot should reject
- Expected: Error message about Peruvian format

#### Invalid Amount
- Send: "100" → Below minimum (S/ 300)
- Send: "10000" → Above maximum (S/ 5,000)
- Expected: Error messages with range

#### Short/Empty Responses
- Name: "ab" → Below 3 characters
- Business: "ve" → Below 3 characters
- Expected: Error messages about minimum length

### Scenario 3: Correction Flow

**Goal:** Verify user can correct data

**Steps:**
1. Start conversation
2. Input incorrect data (e.g., name "X")
3. Bot rejects it
4. Resend correct data
5. Bot accepts and continues
6. Complete the rest of the form

**Expected Result:** User can retry without resetting

### Scenario 4: Multiple Concurrent Users

**Goal:** Verify bot handles multiple users independently

**Steps:**
1. From Phone 1: Start conversation, get to step 3 (DNI)
2. From Phone 2: Start conversation, go through all steps
3. From Phone 1: Send DNI, continue and complete
4. From Phone 2: Receive completion confirmation

**Expected Result:** Both applications save independently in Google Sheets

### Scenario 5: Admin Dashboard

**Goal:** Verify admin panel displays and allows actions

**URL:** `http://localhost:3000`

**Steps:**
1. Open dashboard
2. Verify stats cards show:
   - Total count
   - Pending count
   - Approved count
   - Rejected count
   - Total amount
3. Filter by status (Todas, Pendientes, Aprobadas, Rechazadas)
4. Click "Aprobar" on a pending application
5. Refresh page or wait 10 seconds
6. Verify status changed to "Aprobado" (green badge)
7. Try "Rechazar" on another application

**Expected Result:**
- ✅ Stats update in real-time
- ✅ Table filters work
- ✅ Status changes reflect in Google Sheets
- ✅ Badges show correct colors

### Scenario 6: Reconnection After Disconnect

**Goal:** Verify bot reconnects if WhatsApp connection drops

**Steps:**
1. Bot is running and connected
2. Force disconnect in Terminal: Press Ctrl+C while bot is connected
3. Watch Terminal 1 output for reconnection logic
4. Send message from phone
5. Bot should reconnect and respond

**Expected Output in Terminal:**
```
🔌 Desconectado. Reconectando: true
[Wait 3 seconds]
⏳ Conectando a WhatsApp...
✅ ¡Bot conectado! Listo para recibir mensajes
```

## Data Verification

### In Google Sheets
1. Open your Google Sheet for Impulso Financiero
2. Verify new row appears for each completed application
3. Check columns match expected data:
   - Fecha: Date when submitted
   - Nombre: User's full name
   - DNI: 8-digit ID
   - Teléfono: Phone number
   - Dirección: Address
   - Negocio: Business type
   - Ingresos Mensuales: Monthly income
   - Monto Solicitado: Requested amount
   - Estado: Should be "pendiente" initially

### Via API Endpoint
Test the API directly:

```bash
# Check bot status
curl http://localhost:3000/api/bot/status

# Get all applications
curl http://localhost:3000/api/prestamos

# Get application by DNI (not implemented in current version)
# Would be: curl http://localhost:3000/api/prestamos/12345678
```

## Error Scenarios

### Bot Won't Connect
**Symptom:** QR code shows but no connection
- Check phone has WhatsApp active
- Try scanning QR again
- Look for errors in terminal

### Google Sheets Not Updating
**Symptom:** Application submitted but not in sheet
- Verify credentials.json is correct
- Check service account has Editor access to sheet
- Look for error logs in terminal
- Verify GOOGLE_SPREADSHEET_ID is correct

### Admin Dashboard Shows No Data
**Symptom:** Dashboard loads but table is empty
- Check if applications actually saved to Google Sheets
- Verify API endpoint works: `curl http://localhost:3000/api/prestamos`
- Check browser console for JavaScript errors
- Hard refresh page (Cmd+Shift+R on Mac)

## Performance Notes

- First load of dashboard may take a few seconds (fetches from Google Sheets)
- Auto-refresh interval: 10 seconds
- Bot response time: Usually <1 second
- Google Sheets API calls: ~500ms average

## Test Results Template

```
Date: [DATE]
Tester: [NAME]
OS: [macOS/Linux/Windows]
Browser: [Chrome/Safari/Firefox]

Test Scenarios:
[ ] Complete Loan Application - PASS/FAIL
[ ] Invalid Inputs - PASS/FAIL
[ ] Correction Flow - PASS/FAIL
[ ] Multiple Users - PASS/FAIL
[ ] Admin Dashboard - PASS/FAIL
[ ] Reconnection - PASS/FAIL

Notes:
[Any issues found]
```

## Cleanup After Testing

### Reset for Fresh Test
To start fresh:
1. Clear Google Sheet (leave headers)
2. Delete conversation state: Not persisted in-memory, automatically resets on server restart
3. Restart bot: `Ctrl+C` then `pnpm dev`

### Preserve Test Data
1. Back up Google Sheet before clearing
2. Export as CSV for records

## Next Steps After Testing

If all tests pass:
1. Customize bot messages (in `server/services/whatsappBot.ts`)
2. Adjust validation rules as needed
3. Configure production environment variables
4. Deploy to production server

If issues found:
1. Document the issue and exact steps to reproduce
2. Check terminal logs for error messages
3. Verify all setup steps from SETUP.md
4. Review code and fix the issue
