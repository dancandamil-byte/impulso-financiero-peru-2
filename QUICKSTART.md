# Quick Start - 5 Minutos

## Paso 1: Preparar Google (2 min)

### Crear la Hoja de Google Sheets
1. Ve a [Google Sheets](https://docs.google.com/spreadsheets)
2. Crea nueva hoja: Click "+" → Blank spreadsheet
3. Copia el ID del URL:
   ```
   https://docs.google.com/spreadsheets/d/[ESTE_ID]/edit
   ```

### Crear Google Cloud Service Account
1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea nuevo proyecto: "Impulso Financiero"
3. Habilita Google Sheets API:
   - Busca "Google Sheets API" 
   - Click "Enable"
4. Crea Service Account:
   - Menú: APIs & Services → Service Accounts
   - Click "Create Service Account"
   - Nombre: `impulso-bot`
   - Click "Create and Continue"
5. Descarga JSON key:
   - Tab "Keys" de la cuenta
   - Click "Add Key" → "Create new key"
   - Elige "JSON" → Descarga
6. Mueve archivo a:
   ```
   impulso-financiero-peru-2/credentials.json
   ```
7. Comparte la hoja con el email del service account

## Paso 2: Configurar Proyecto (1 min)

```bash
cd impulso-financiero-peru-2

# Edita .env
nano .env

# Reemplaza:
# GOOGLE_SPREADSHEET_ID = [Tu ID de la hoja]
# GOOGLE_CREDENTIALS_PATH = ./credentials.json
```

## Paso 3: Instalar y Ejecutar (2 min)

```bash
# Instalar dependencias
pnpm install

# Ejecutar bot + servidor
pnpm dev
```

**Esperarás ver:**
```
✓ Server running on http://localhost:3000/
✅ Google Sheets API inicializado
🚀 Iniciando WhatsApp Bot...
🔗 QR Code generado, escanea para conectar:
[QR CODE ASCII]
```

## Paso 4: Conectar WhatsApp

En tu teléfono:
1. Abre WhatsApp
2. Settings → Linked Devices (o Dispositivos Vinculados)
3. "Link a Device" → Escanea el código QR del terminal
4. Espera confirmación: `✅ ¡Bot conectado! Listo para recibir mensajes`

## Paso 5: Probar

### En WhatsApp
1. Envía un mensaje al bot (cualquier cosa)
2. Bot responde con bienvenida
3. Sigue las preguntas

### En Navegador
1. Ve a `http://localhost:3000`
2. Verás el dashboard administrativo
3. Aparecerán las solicitudes conforme las completes en WhatsApp

---

## ✅ Verificación

- [ ] Google Sheet creada y compartida
- [ ] credentials.json descargado y en carpeta raíz
- [ ] .env completado con IDs
- [ ] `pnpm dev` corre sin errores
- [ ] QR code visible en terminal
- [ ] WhatsApp conectado (bot responde)
- [ ] Dashboard carga en navegador

---

## 🎯 Prueba Completa en 5 Minutos

**En WhatsApp:**
```
Tú: Hola
Bot: 🎉 ¡Hola! Bienvenido... [responde con nombre]
Tú: Juan Pérez
Bot: ✅ Perfecto, Juan Pérez... [siguiente pregunta]
[Continúa con: DNI, teléfono, dirección, negocio, ingresos, monto]
Bot: [Resume datos] ¿Es correcto?
Tú: SI
Bot: ✅ ¡Tu solicitud fue registrada correctamente!
```

**En navegador:**
- Abre `http://localhost:3000`
- Deberías ver tu solicitud en la tabla
- Status: "Pendiente"

---

## 🚀 ¿Listo?

Si todo funcionó:
```bash
# Continúa con testing más detallado
# Lee: TESTING.md

# O para personalizar mensajes
# Edita: server/services/whatsappBot.ts
```

---

## 🆘 Problemas Comunes

| Problema | Solución |
|----------|----------|
| "GOOGLE_SPREADSHEET_ID no configurado" | Verifica .env existe y PORT 3000 disponible |
| "credentials.json not found" | Asegúrate está en carpeta raíz, no en carpetas |
| Bot no responde | Rescandea el código QR |
| Datos no se guardan | Verifica Google Sheet compartida con service account |

---

**Duración estimada:** ⏱️ 5-10 minutos  
**Dificultad:** 🟢 Fácil  
**Requisitos:** Una cuenta Google y un teléfono con WhatsApp
