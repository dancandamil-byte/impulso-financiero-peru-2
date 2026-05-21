# Setup Paso a Paso - Google Sheets + Google Cloud

## Parte 1️⃣: Crear Google Sheet (2 minutos)

### Paso 1.1: Crear la Hoja
1. Abre tu navegador y ve a: **https://docs.google.com/spreadsheets**
2. Haz click en el **botón "+" o "Nueva hoja"**
3. Elige **"Hoja en blanco"**
4. Se abrirá una nueva hoja

### Paso 1.2: Copiar el ID
1. Mira la URL en la barra de direcciones. Verás algo como:
   ```
   https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p/edit#gid=0
   ```
2. **Copia la parte entre `/d/` y `/edit`** (todo eso es el ID)
   - Ejemplo: `1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p`
3. **Guarda este ID en un lugar seguro** (lo necesitarás después)

### Paso 1.3: Nombrar la Hoja (Opcional pero Recomendado)
1. Haz click en el nombre por defecto "Untitled spreadsheet" (arriba a la izquierda)
2. Escribe: `Impulso Financiero - Solicitudes`
3. Presiona Enter

✅ **Completado: Tienes tu Google Sheet listo**

---

## Parte 2️⃣: Crear Google Cloud Service Account (3 minutos)

### Paso 2.1: Ir a Google Cloud Console
1. Abre una **nueva pestaña** del navegador
2. Ve a: **https://console.cloud.google.com**
3. Verás el **Google Cloud Console**

### Paso 2.2: Crear un Nuevo Proyecto
1. Arriba a la izquierda, haz click en el **selector de proyecto** (dice "Select a Project" o un nombre)
2. Click en **"NEW PROJECT"**
3. **Nombre del proyecto:** `Impulso Financiero Bot`
4. Click **"CREATE"**
5. **Espera a que se cree** (puede tomar 1-2 minutos)
6. Una vez creado, verás confirmación. Click en **"SELECT PROJECT"**

### Paso 2.3: Habilitar Google Sheets API
1. En la barra de búsqueda (arriba), busca: `Google Sheets API`
2. Haz click en el resultado
3. Verás un botón **"ENABLE"** en azul
4. Haz click en él
5. **Espera confirmación** (puede decir "Enabling..." por unos segundos)

### Paso 2.4: Crear Service Account
1. En el menú de la izquierda, busca: **"Service Accounts"** 
   - O ve a: APIs & Services → Service Accounts
2. Haz click en **"CREATE SERVICE ACCOUNT"**
3. Completa los campos:
   - **Service account name:** `impulso-bot`
   - **Service account ID:** Se llena automáticamente
   - **Description:** `Bot WhatsApp para Impulso Financiero`
4. Click **"CREATE AND CONTINUE"**
5. En la sección de "Grant roles" (siguiente paso):
   - Busca: `Editor`
   - Selecciona: **"Basic" → "Editor"**
   - Click **"CONTINUE"**
6. Click **"DONE"**

✅ **Service Account creada**

### Paso 2.5: Crear y Descargar JSON Key
1. En la lista de Service Accounts, haz click en el que acabas de crear: `impulso-bot`
2. Ve a la pestaña **"KEYS"**
3. Click en **"ADD KEY" → "Create new key"**
4. Elige **"JSON"**
5. Automáticamente descargará un archivo `impulso-bot-[números].json`

### Paso 2.6: Copiar credentials.json
1. El archivo descargado está probablemente en tu carpeta **Downloads**
2. **Renómbralo a:** `credentials.json` (exacto, sin números)
3. **Muévelo a tu carpeta del proyecto:**
   ```
   Proyecto Marketing Impulso Financiero/impulso-financiero-peru-2/
   ```
4. Asegúrate que esté **en la raíz del proyecto**, no en una subcarpeta

### Paso 2.7: Obtener el Email del Service Account
1. Vuelve a la página del Service Account (`impulso-bot`)
2. Copia el **"Service account email"** (algo como: `impulso-bot@proyecto-xxx.iam.gserviceaccount.com`)
3. **Guarda este email** para el siguiente paso

✅ **Completado: credentials.json descargado y listo**

---

## Parte 3️⃣: Compartir Google Sheet con Service Account (1 minuto)

### Paso 3.1: Abrir tu Google Sheet
1. Vuelve a la pestaña donde creaste el Google Sheet
2. Haz click en el botón **"SHARE"** (arriba a la derecha)

### Paso 3.2: Compartir con Service Account
1. En el cuadro de diálogo, pega el email del service account:
   - `impulso-bot@proyecto-xxx.iam.gserviceaccount.com`
2. Elige el permiso: **"Editor"**
3. **Desactiva** "Notify people" (no necesitas notificaciones)
4. Click **"SHARE"**
5. Debería mostrar: ✅ "Access has been granted"

✅ **Completado: Sheet compartida**

---

## Parte 4️⃣: Actualizar el Archivo .env

### Paso 4.1: Editar .env
1. Abre tu editor de código (VS Code, etc.)
2. Abre el archivo: `impulso-financiero-peru-2/.env`
3. Reemplaza los valores vacíos:

```env
# ANTES:
GOOGLE_SPREADSHEET_ID=

# DESPUÉS (tu ID de la hoja):
GOOGLE_SPREADSHEET_ID=1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p

# El GOOGLE_CREDENTIALS_PATH ya debería ser:
GOOGLE_CREDENTIALS_PATH=./credentials.json

# El resto no cambies:
PORT=3000
NODE_ENV=development
```

4. **Reemplaza `1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p`** con tu ID real de la hoja
5. **Guarda el archivo**

✅ **Completado: .env configurado**

---

## ✅ Verificación Final

Antes de continuar, verifica que tengas:

- [ ] Google Sheet creado
- [ ] ID copiado en .env
- [ ] Google Cloud Service Account creado
- [ ] JSON key descargado y renombrado a `credentials.json`
- [ ] `credentials.json` en la carpeta raíz del proyecto
- [ ] Google Sheet compartido con el email del service account
- [ ] .env completado con GOOGLE_SPREADSHEET_ID

---

## 🚀 Siguiente Paso

Una vez completes todo esto, abre la terminal y ejecuta:

```bash
cd "Proyecto Marketing Impulso Financiero/impulso-financiero-peru-2"

# Instala las dependencias
pnpm install

# Inicia el bot
pnpm dev
```

**Verás:**
- ✅ Server running on http://localhost:3000
- 🚀 Iniciando WhatsApp Bot
- 🔗 QR Code para escanear

---

## 🆘 Problemas Comunes

| Problema | Solución |
|----------|----------|
| No encuentro el ID de la hoja | Mira la URL en la barra de direcciones entre `/d/` y `/edit` |
| "credentials.json not found" | Asegúrate que está en la carpeta raíz, no en carpetas |
| "Permission denied" en Google Sheets | Verifica que compartiste la hoja con el email EXACTO del service account |
| "GOOGLE_SPREADSHEET_ID error" | Revisa que no haya espacios extras en el .env |

---

## 📝 Notas Importantes

- **No subas credentials.json a GitHub** - ya está en .gitignore
- **El GOOGLE_SPREADSHEET_ID es la larga cadena de caracteres**, no el nombre de la hoja
- **Deja el GOOGLE_CREDENTIALS_PATH como está:** `./credentials.json`

---

**¿Necesitas ayuda con algún paso?**  
Házmelo saber cuál paso específico y te ayudaré.
