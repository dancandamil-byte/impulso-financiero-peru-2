import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { SolicitudPrestamo } from '../../shared/types.js';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

export class GoogleSheetsService {
  private sheetsAPI: any;
  private auth: any;
  private spreadsheetId: string;

  constructor(spreadsheetId: string) {
    this.spreadsheetId = spreadsheetId;
  }

  async initialize() {
    try {
      // Intentar cargar credenciales desde archivo
      const credentialsPath = process.env.GOOGLE_CREDENTIALS_PATH || 'credentials.json';

      if (!fs.existsSync(credentialsPath)) {
        console.warn(`Archivo de credenciales no encontrado en ${credentialsPath}`);
        console.warn('Por favor, crea un Service Account en Google Cloud Console y descarga el JSON');
        return false;
      }

      const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

      this.auth = new google.auth.GoogleAuth({
        credentials,
        scopes: SCOPES,
      });

      this.sheetsAPI = google.sheets({
        version: 'v4',
        auth: this.auth,
      });

      console.log('✓ Google Sheets API inicializado correctamente');
      return true;
    } catch (error) {
      console.error('Error inicializando Google Sheets:', error);
      return false;
    }
  }

  async ensureSheetExists(sheetName: string = 'Solicitudes') {
    try {
      const spreadsheet = await this.sheetsAPI.spreadsheets.get({
        spreadsheetId: this.spreadsheetId,
      });

      const sheetExists = spreadsheet.data.sheets?.some(
        (sheet: any) => sheet.properties?.title === sheetName
      );

      if (!sheetExists) {
        // Crear la hoja si no existe
        await this.sheetsAPI.spreadsheets.batchUpdate({
          spreadsheetId: this.spreadsheetId,
          requestBody: {
            requests: [
              {
                addSheet: {
                  properties: {
                    title: sheetName,
                  },
                },
              },
            ],
          },
        });

        // Agregar encabezados
        await this.sheetsAPI.spreadsheets.values.append({
          spreadsheetId: this.spreadsheetId,
          range: `${sheetName}!A1`,
          valueInputOption: 'RAW',
          requestBody: {
            values: [
              [
                'Fecha',
                'Nombre',
                'DNI',
                'Teléfono',
                'Dirección',
                'Negocio',
                'Ingresos Mensuales',
                'Monto Solicitado',
                'Estado',
              ],
            ],
          },
        });

        console.log(`✓ Hoja "${sheetName}" creada con encabezados`);
      }
    } catch (error) {
      console.error('Error asegurando que la hoja exista:', error);
      throw error;
    }
  }

  async guardarSolicitud(
    solicitud: SolicitudPrestamo,
    sheetName: string = 'Solicitudes'
  ): Promise<boolean> {
    try {
      const fila = [
        new Date().toLocaleString('es-PE'),
        solicitud.nombre,
        solicitud.dni,
        solicitud.telefono,
        solicitud.direccion,
        solicitud.negocio,
        solicitud.ingresos,
        solicitud.montoSolicitado,
        solicitud.estado || 'pendiente',
      ];

      await this.sheetsAPI.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A:I`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [fila],
        },
      });

      console.log(
        `✓ Solicitud guardada para ${solicitud.nombre} (DNI: ${solicitud.dni})`
      );
      return true;
    } catch (error) {
      console.error('Error guardando solicitud en Google Sheets:', error);
      return false;
    }
  }

  async obtenerSolicitudes(sheetName: string = 'Solicitudes'): Promise<SolicitudPrestamo[]> {
    try {
      const response = await this.sheetsAPI.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A:I`,
      });

      const rows = response.data.values || [];
      if (rows.length <= 1) return [];

      // Saltar encabezados y convertir a objetos
      return rows.slice(1).map((row: any[]) => ({
        fecha: new Date(row[0]),
        nombre: row[1],
        dni: row[2],
        telefono: row[3],
        direccion: row[4],
        negocio: row[5],
        ingresos: parseFloat(row[6]) || 0,
        montoSolicitado: parseFloat(row[7]) || 0,
        estado: row[8] || 'pendiente',
      }));
    } catch (error) {
      console.error('Error obteniendo solicitudes:', error);
      return [];
    }
  }

  async actualizarEstado(
    dni: string,
    nuevoEstado: 'pendiente' | 'aprobado' | 'rechazado',
    sheetName: string = 'Solicitudes'
  ): Promise<boolean> {
    try {
      const solicitudes = await this.obtenerSolicitudes(sheetName);
      const filaIndex = solicitudes.findIndex((s) => s.dni === dni);

      if (filaIndex === -1) {
        console.error(`No se encontró solicitud con DNI: ${dni}`);
        return false;
      }

      await this.sheetsAPI.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!I${filaIndex + 2}`, // +2 porque incluye encabezados y arrays indexan desde 0
        valueInputOption: 'RAW',
        requestBody: {
          values: [[nuevoEstado]],
        },
      });

      console.log(`✓ Estado actualizado para DNI ${dni}: ${nuevoEstado}`);
      return true;
    } catch (error) {
      console.error('Error actualizando estado:', error);
      return false;
    }
  }
}
