# WhatsApp Bot - Impulso Financiero Perú

## 📋 Resumen de la Solución

Se ha implementado un **bot de WhatsApp conversacional** que automatiza la recopilación de solicitudes de préstamo y las almacena en Google Sheets para revisión administrativa.

### Características Principales

✅ **Conversación de 9 pasos** - Recopila información estructurada del cliente
✅ **Validación robusta** - Valida cada campo según formato peruano
✅ **Google Sheets integration** - Almacenamiento automático de solicitudes
✅ **Panel administrativo** - Dashboard para revisar y aprobar solicitudes
✅ **API REST** - Endpoints para integración y automatización
✅ **Gratuit y local** - Usa Baileys (sin costo) y se ejecuta en tu servidor
✅ **TypeScript** - Código completamente tipado

---

## 🏗️ Arquitectura

```
Cliente WhatsApp
        ↓
    [Baileys Bot]
        ↓
  [Express Server]
        ↓
   [Google Sheets]
        ↓
[Admin Dashboard]
```

### Flujo de Datos

1. **Usuario envía mensaje** → WhatsApp
2. **Bot recibe** a través de Baileys
3. **Procesa conversación** → ConversationManager valida datos
4. **Guarda solicitud** → Google Sheets (cuando confirma)
5. **Admin revisa** en dashboard → Aprueba o rechaza
6. **Estado sincroniza** → Google Sheets actualiza

---

## 📁 Estructura de Archivos Implementados

### Backend (Node.js + Express)

```
server/
├── index.ts                          # Servidor principal, rutas API
├── services/
│   ├── whatsappBot.ts               # Bot con máquina de estados de 9 pasos
│   ├── conversationManager.ts        # Gestor de estado conversacional
│   ├── googleSheets.ts              # Integración Google Sheets API
│   └── conversationManager.ts        # Validadores de datos
```

**Rutas API disponibles:**
- `GET /api/prestamos` - Obtiene todas las solicitudes
- `POST /api/prestamos` - Crea nueva solicitud (usado por bot)
- `PATCH /api/prestamos/:dni/estado` - Actualiza estado (admin)
- `GET /api/bot/status` - Verifica si bot está conectado

### Frontend (React + TypeScript)

```
client/
└── src/
    └── pages/
        └── Admin.tsx                # Dashboard administrativo
```

**Características del dashboard:**
- Tabla de solicitudes con 9 columnas
- Filtrado por estado (Pendiente, Aprobado, Rechazado)
- Estadísticas en tarjetas (Total, Pendientes, Aprobadas, etc.)
- Botones para aprobar/rechazar
- Auto-refresh cada 10 segundos

### Tipos Compartidos

```
shared/
└── types.ts                          # Interfaces TypeScript
```

**Tipos principales:**
- `SolicitudPrestamo` - Estructura de solicitud de préstamo
- `ConversationState` - Estado de conversación por usuario
- `ConversationStep` - 9 pasos del flujo conversacional
- `ValidationResult` - Resultado de validaciones

---

## 🤖 Flujo de Conversación del Bot

El bot guía al usuario a través de 9 pasos:

```
1. INICIO
   ↓ [Usuario responde]
2. NOMBRE        "¿Cuál es tu nombre completo?"
   ↓ [Usuario: Pedro García]
3. DNI           "¿Cuál es tu DNI?"
   ↓ [Usuario: 12345678]
4. TELÉFONO      "¿Cuál es tu número de WhatsApp?"
   ↓ [Usuario: 987654321]
5. DIRECCIÓN     "¿Cuál es tu dirección?"
   ↓ [Usuario: Calle Principal 123]
6. NEGOCIO       "¿Qué tipo de negocio tienes?"
   ↓ [Usuario: Vendo ropa]
7. INGRESOS      "¿Cuál es tu ingreso mensual?"
   ↓ [Usuario: 2000]
8. MONTO         "¿Cuánto deseas solicitar? (S/ 300-5,000)"
   ↓ [Usuario: 1500]
9. CONFIRMACIÓN  "¿Es correcto?" 
   ↓ [Usuario: SI]
10. COMPLETADA   "Solicitud registrada" → Guardada en Google Sheets
```

### Validaciones en Cada Paso

| Campo | Validación | Ejemplo |
|-------|-----------|---------|
| Nombre | Mín. 3 caracteres | "Pedro García" ✓ |
| DNI | Exactamente 8 dígitos | "12345678" ✓ |
| Teléfono | Formato peruano 9XXXXXXXX | "987654321" ✓ |
| Dirección | Mín. 5 caracteres | "Calle Principal 123" ✓ |
| Negocio | Mín. 3 caracteres | "Vendo ropa" ✓ |
| Ingresos | Número positivo | "2000" ✓ |
| Monto | Entre S/ 300 y S/ 5,000 | "1500" ✓ |

---

## 🔧 Tecnologías Utilizadas

### Dependencias Principales

| Paquete | Propósito | Versión |
|---------|-----------|---------|
| **baileys** | Bot WhatsApp | 6.17.16 |
| **express** | Servidor web | 4.21.2 |
| **googleapis** | Google Sheets API | 140.0.1 |
| **google-auth-library** | Autenticación Google | 9.4.1 |
| **dotenv** | Variables de entorno | 16.4.5 |
| **typescript** | Lenguaje tipado | 5.8.2 |
| **vite** | Build tool frontend | 7.1.9 |
| **react** | Framework UI | 18.x |

---

## ⚙️ Configuración Requerida

### 1. Variables de Entorno (`.env`)

```env
# Google Sheets
GOOGLE_SPREADSHEET_ID=tu_id_aqui
GOOGLE_CREDENTIALS_PATH=./credentials.json

# Servidor
PORT=3000
NODE_ENV=development
```

### 2. Google Cloud Service Account

1. Crear Service Account en Google Cloud Console
2. Descargar JSON y guardar como `credentials.json`
3. Compartir Google Sheet con el email del service account

### 3. Hoja de Google Sheets

Columnas automáticas creadas:
- Fecha
- Nombre
- DNI
- Teléfono
- Dirección
- Negocio
- Ingresos Mensuales
- Monto Solicitado
- Estado

---

## 🚀 Cómo Usar

### 1. Instalación

```bash
# Instalar dependencias
pnpm install

# Compilar sin errores
pnpm check
```

### 2. Configuración

```bash
# Copiar plantilla
cp .env.example .env

# Editar y llenar:
# - GOOGLE_SPREADSHEET_ID (de tu Google Sheet)
# - GOOGLE_CREDENTIALS_PATH (credentials.json)
```

### 3. Ejecutar

```bash
# Desarrollo
pnpm dev

# Verás:
# ✅ Server running on http://localhost:3000/
# 🚀 Iniciando WhatsApp Bot...
# 🔗 QR Code generado - escanea con WhatsApp
```

### 4. Autenticar Bot

1. En tu teléfono: Abre WhatsApp
2. Usa "Linked Devices" o "Dispositivos vinculados"
3. Escanea el código QR del terminal
4. Bot mostrará: `✅ ¡Bot conectado! Listo para recibir mensajes`

### 5. Probar

**En WhatsApp:** Envía cualquier mensaje al bot
**En navegador:** Abre `http://localhost:3000` para el dashboard admin

---

## 📊 Panel Administrativo

**URL:** `http://localhost:3000`

### Estadísticas en Tiempo Real
- **Total:** Cantidad de solicitudes recibidas
- **Pendientes:** Esperando revisión
- **Aprobadas:** Ya revisadas y aprobadas
- **Rechazadas:** Rechazadas por admin
- **Monto Total:** Suma de todos los montos solicitados

### Tabla de Solicitudes
Muestra:
- Fecha exacta de solicitud
- Datos del cliente (nombre, DNI, teléfono)
- Tipo de negocio
- Ingresos mensuales reportados
- Monto solicitado
- Estado actual
- Botones de acción (Aprobar/Rechazar)

### Funcionalidades
✅ Filtrar por estado
✅ Ver todos los campos
✅ Cambiar estado con un clic
✅ Auto-refresh cada 10 segundos
✅ Información sincronizada con Google Sheets

---

## 🔌 API Endpoints

### GET /api/prestamos
Obtiene todas las solicitudes de Google Sheets

```bash
curl http://localhost:3000/api/prestamos
```

**Respuesta:**
```json
[
  {
    "fecha": "2025-05-16T10:30:00Z",
    "nombre": "Pedro García",
    "dni": "12345678",
    "telefono": "987654321",
    "direccion": "Calle Principal 123",
    "negocio": "Vendo ropa",
    "ingresos": 2000,
    "montoSolicitado": 1500,
    "estado": "pendiente"
  }
]
```

### POST /api/prestamos
Crea nueva solicitud (usado internamente por el bot)

### PATCH /api/prestamos/:dni/estado
Actualiza el estado de una solicitud

```bash
curl -X PATCH http://localhost:3000/api/prestamos/12345678/estado \
  -H "Content-Type: application/json" \
  -d '{"estado": "aprobado"}'
```

### GET /api/bot/status
Verifica si el bot está conectado

```bash
curl http://localhost:3000/api/bot/status
```

**Respuesta:**
```json
{
  "connected": true,
  "message": "Bot conectado y listo"
}
```

---

## 🧪 Testing

Sigue la guía en `TESTING.md` para:
- ✅ Prueba de flujo completo de aplicación
- ✅ Validación de entradas
- ✅ Flujo de corrección
- ✅ Usuarios simultáneos
- ✅ Dashboard administrativo
- ✅ Reconexión automática

---

## 📝 Documentación Adicional

- **SETUP.md** - Guía de instalación y configuración Google Cloud
- **TESTING.md** - Escenarios de testing detallados
- **.env.example** - Plantilla de variables de entorno

---

## 🎯 Funcionalidades Adicionales Posibles

Para versiones futuras:

- [ ] Persistencia de conversaciones (Redis)
- [ ] Webhook para notificaciones
- [ ] Exportar solicitudes a CSV/Excel
- [ ] Cálculo automático de monto máximo
- [ ] SMS para notificaciones de estado
- [ ] Múltiples idiomas
- [ ] Análisis de riesgo automático
- [ ] Integración con sistema bancario

---

## ❓ Preguntas Frecuentes

**P: ¿El bot guarda contraseñas?**
R: No. Solo guarda datos públicos del usuario. Las credenciales de Google están en `credentials.json` (no subir a git).

**P: ¿Qué pasa si el servidor se cae?**
R: El bot intenta reconectar automáticamente cada 3 segundos.

**P: ¿Cuánto cuesta?**
R: $0 - Baileys es gratuito, Google Sheets tiene plan gratuito.

**P: ¿Puedo personalizar los mensajes?**
R: Sí - edita los métodos `paso*()` en `server/services/whatsappBot.ts`

**P: ¿Cuántos usuarios simultáneos soporta?**
R: Ilimitados en desarrollo. En producción depende del servidor.

---

## 🚨 Soporte y Debugging

Si tienes problemas:

1. Revisa la terminal donde corre el bot (logs detallados)
2. Verifica que `credentials.json` está en el directorio raíz
3. Comprueba que el Google Sheet está compartido con el service account
4. Asegúrate que `GOOGLE_SPREADSHEET_ID` es correcto (sin espacios)
5. Intenta scanear el código QR nuevamente

---

## 📄 Licencia

MIT

---

**Versión:** 1.0.0  
**Última actualización:** 2025-05-16  
**Estado:** ✅ Implementación completada
