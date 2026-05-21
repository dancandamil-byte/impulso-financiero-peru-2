// Solicitud de préstamo enviada por el cliente
export interface SolicitudPrestamo {
  id?: string;
  fecha: Date;
  nombre: string;
  dni: string;
  telefono: string;
  direccion: string;
  negocio: string;
  ingresos: number;
  montoSolicitado: number;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
}

// Estado de la conversación con un usuario
export interface ConversationState {
  userId: string;
  telefono: string;
  step: ConversationStep;
  data: Partial<SolicitudPrestamo>;
  ultimaActualizacion: Date;
}

// Pasos de la conversación
export type ConversationStep =
  | 'inicio'
  | 'nombre'
  | 'dni'
  | 'telefono'
  | 'direccion'
  | 'negocio'
  | 'ingresos'
  | 'monto'
  | 'confirmacion'
  | 'completada';

// Mensajes de WhatsApp
export interface WhatsAppMessage {
  from: string;
  body: string;
  timestamp: number;
}

// Respuesta del bot
export interface BotResponse {
  to: string;
  message: string;
  mediaUrl?: string;
}

// Configuración de Google Sheets
export interface GoogleSheetsConfig {
  spreadsheetId: string;
  sheetsAPI: any;
  auth: any;
}

// Validación de datos
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}
