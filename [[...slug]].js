// Vercel serverless function that runs the Express server
import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import { GoogleSheetsService } from './server/services/googleSheets.js';
import { WhatsAppBot } from './server/services/whatsappBot.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let googleSheets;
let whatsappBot;
let app = null;

function createApp() {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // CORS
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  // Inicializar Google Sheets
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
  if (spreadsheetId) {
    googleSheets = new GoogleSheetsService(spreadsheetId);
  }

  // Inicializar WhatsApp Bot (async, but we won't await in this context)
  whatsappBot = new WhatsAppBot(googleSheets);
  try {
    whatsappBot.iniciar().catch(error => {
      console.error("❌ Error iniciando WhatsApp Bot:", error);
    });
  } catch (error) {
    console.error("❌ Error iniciando WhatsApp Bot:", error);
  }

  // API Routes
  app.post("/api/prestamos", async (req, res) => {
    try {
      const { nombre, dni, telefono, direccion, negocio, ingresos, montoSolicitado } = req.body;

      if (!googleSheets) {
        return res.status(500).json({ error: "Google Sheets no está configurado" });
      }

      const solicitud = {
        fecha: new Date(),
        nombre,
        dni,
        telefono,
        direccion,
        negocio,
        ingresos: parseFloat(ingresos),
        montoSolicitado: parseFloat(montoSolicitado),
        estado: "pendiente",
      };

      const guardado = await googleSheets.guardarSolicitud(solicitud);

      if (guardado) {
        res.json({ success: true, message: "Solicitud guardada correctamente" });
      } else {
        res.status(500).json({ error: "Error guardando solicitud" });
      }
    } catch (error) {
      console.error("Error en /api/prestamos:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  app.get("/api/prestamos", async (req, res) => {
    try {
      if (!googleSheets) {
        return res.status(500).json({ error: "Google Sheets no está configurado" });
      }

      const solicitudes = await googleSheets.obtenerSolicitudes();
      res.json(solicitudes);
    } catch (error) {
      console.error("Error obteniendo prestamos:", error);
      res.status(500).json({ error: "Error obteniendo solicitudes" });
    }
  });

  app.patch("/api/prestamos/:dni/estado", async (req, res) => {
    try {
      const { dni } = req.params;
      const { estado } = req.body;

      if (!googleSheets) {
        return res.status(500).json({ error: "Google Sheets no está configurado" });
      }

      const actualizado = await googleSheets.actualizarEstado(dni, estado);

      if (actualizado) {
        res.json({ success: true, message: "Estado actualizado" });
      } else {
        res.status(404).json({ error: "Solicitud no encontrada" });
      }
    } catch (error) {
      console.error("Error actualizando estado:", error);
      res.status(500).json({ error: "Error actualizando estado" });
    }
  });

  app.get("/api/bot/status", (req, res) => {
    res.json({
      connected: whatsappBot?.estaConectado() || false,
      message: whatsappBot?.estaConectado() ? "Bot conectado y listo" : "Bot desconectado",
    });
  });

  // Serve static React app
  const staticPath = path.resolve(__dirname, 'dist/public');
  app.use(express.static(staticPath));

  // Client-side routing fallback
  app.get("*", (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
  });

  return app;
}

export default async function handler(req, res) {
  if (!app) {
    app = createApp();
  }

  // Pass the request to the Express app
  return app(req, res);
}
