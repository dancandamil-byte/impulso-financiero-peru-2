import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import 'dotenv/config';
import { GoogleSheetsService } from "./services/googleSheets.js";
import { WhatsAppBot } from "./services/whatsappBot.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let googleSheets: GoogleSheetsService;
let whatsappBot: WhatsAppBot;

async function startServer() {
  const app = express();
  const server = createServer(app);

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
  if (!spreadsheetId) {
    console.warn("⚠️  GOOGLE_SPREADSHEET_ID no configurado. Panel admin no funcionará.");
  } else {
    googleSheets = new GoogleSheetsService(spreadsheetId);
    const initialized = await googleSheets.initialize();
    if (initialized) {
      await googleSheets.ensureSheetExists();
    }
  }

  // Inicializar WhatsApp Bot
  whatsappBot = new WhatsAppBot(googleSheets);
  try {
    console.log("🚀 Iniciando WhatsApp Bot...");
    await whatsappBot.iniciar();
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
        estado: "pendiente" as const,
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

      const actualizado = await googleSheets.actualizarEstado(
        dni,
        estado as 'pendiente' | 'aprobado' | 'rechazado'
      );

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
      message: whatsappBot?.estaConectado()
        ? "Bot conectado y listo"
        : "Bot desconectado",
    });
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`✅ Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
