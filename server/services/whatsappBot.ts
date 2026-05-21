import makeWASocket, { DisconnectReason, useMultiFileAuthState } from 'baileys';
import { Boom } from '@hapi/boom';
import qrcode from 'qrcode-terminal';
import { ConversationManager, ValidadorDatos } from './conversationManager.js';
import { GoogleSheetsService } from './googleSheets.js';
import { ConversationStep } from '../../shared/types.js';

export class WhatsAppBot {
  private sock: any;
  private conversationManager: ConversationManager;
  private googleSheets: GoogleSheetsService;
  private isConnected: boolean = false;

  constructor(googleSheets: GoogleSheetsService) {
    this.conversationManager = new ConversationManager();
    this.googleSheets = googleSheets;
  }

  async iniciar() {
    try {
      const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

      this.sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
      });

      // Evento de conexión
      this.sock.ev.on('connection.update', async (update: any) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
          console.log('🔗 QR Code generado, escanea para conectar:');
          qrcode.generate(qr, { small: true });
        }

        if (connection === 'connecting') {
          console.log('⏳ Conectando a WhatsApp...');
        }

        if (connection === 'open') {
          console.log('✅ ¡Bot conectado! Listo para recibir mensajes');
          this.isConnected = true;
        }

        if (connection === 'close') {
          this.isConnected = false;
          const shouldReconnect =
            lastDisconnect?.error instanceof Boom &&
            lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut;

          console.log(
            `🔌 Desconectado. Reconectando: ${shouldReconnect}`
          );

          if (shouldReconnect) {
            setTimeout(() => this.iniciar(), 3000);
          }
        }
      });

      // Guardar credenciales cuando cambian
      this.sock.ev.on('creds.update', saveCreds);

      // Evento de mensajes recibidos
      this.sock.ev.on('messages.upsert', async (m: any) => {
        const msg = m.messages[0];
        if (!msg.message) return;

        const remoteJid = msg.key.remoteJid;
        const texto = msg.message.conversation || msg.message.extendedTextMessage?.text || '';

        if (!remoteJid || !texto) return;

        console.log(`📱 Mensaje de ${remoteJid}: ${texto}`);

        // Procesar mensaje y enviar respuesta
        const respuesta = await this.procesarMensaje(remoteJid, texto);
        if (respuesta) {
          await this.enviarMensaje(remoteJid, respuesta);
        }
      });
    } catch (error) {
      console.error('❌ Error inicializando WhatsApp Bot:', error);
      throw error;
    }
  }

  private async procesarMensaje(remoteJid: string, texto: string): Promise<string | null> {
    const telefono = remoteJid.replace('@s.whatsapp.net', '');
    const conv = this.conversationManager.obtenerConversacion(telefono);

    // Normalizar texto
    const textoLimpio = texto.trim().toLowerCase();

    // Comandos especiales
    if (textoLimpio === 'salir' || textoLimpio === '/salir') {
      this.conversationManager.reiniciarConversacion(telefono);
      return '👋 Conversación reiniciada. Escribe cualquier cosa para comenzar de nuevo.';
    }

    // Flujo conversacional
    switch (conv.step) {
      case 'inicio':
        return this.pasoInicio(telefono);

      case 'nombre':
        return this.pasoNombre(telefono, texto);

      case 'dni':
        return this.pasoDNI(telefono, texto);

      case 'telefono':
        return this.pasoTelefono(telefono, texto);

      case 'direccion':
        return this.pasoDireccion(telefono, texto);

      case 'negocio':
        return this.pasoNegocio(telefono, texto);

      case 'ingresos':
        return this.pasoIngresos(telefono, texto);

      case 'monto':
        return this.pasoMonto(telefono, texto);

      case 'confirmacion':
        return await this.pasoConfirmacion(telefono, textoLimpio);

      default:
        return this.pasoInicio(telefono);
    }
  }

  private pasoInicio(telefono: string): string {
    this.conversationManager.avanzeStep(telefono);

    return `🎉 ¡Hola! Bienvenido a Impulso Financiero Perú.

Somos especialistas en microcréditos rápidos sin aval, ideales para emprendedores.

✨ Nuestros beneficios:
• Aprobación en 24 horas
• Montos de S/ 300 a S/ 5,000
• Sin aval requerido
• Proceso simple y rápido

Para solicitar un préstamo, por favor dime tu nombre completo:`;
  }

  private pasoNombre(telefono: string, nombre: string): string {
    const validacion = ValidadorDatos.validarNombre(nombre);

    if (!validacion.isValid) {
      return validacion.error!;
    }

    this.conversationManager.guardarDato(telefono, 'nombre', nombre);
    this.conversationManager.avanzeStep(telefono);

    return `✅ Perfecto, ${nombre}.

Ahora necesitamos tu DNI (8 dígitos):`;
  }

  private pasoDNI(telefono: string, dni: string): string {
    const validacion = ValidadorDatos.validarDNI(dni);

    if (!validacion.isValid) {
      return validacion.error!;
    }

    this.conversationManager.guardarDato(telefono, 'dni', dni);
    this.conversationManager.avanzeStep(telefono);

    return `✅ DNI registrado.

¿Cuál es tu número de WhatsApp? (formato: 9XXXXXXXX):`;
  }

  private pasoTelefono(telefono: string, telIngresado: string): string {
    const validacion = ValidadorDatos.validarTelefono(telIngresado);

    if (!validacion.isValid) {
      return validacion.error!;
    }

    this.conversationManager.guardarDato(telefono, 'telefono', telIngresado);
    this.conversationManager.avanzeStep(telefono);

    return `✅ Teléfono guardado.

¿Cuál es tu dirección de vivienda?`;
  }

  private pasoDireccion(telefono: string, direccion: string): string {
    const validacion = ValidadorDatos.validarDireccion(direccion);

    if (!validacion.isValid) {
      return validacion.error!;
    }

    this.conversationManager.guardarDato(telefono, 'direccion', direccion);
    this.conversationManager.avanzeStep(telefono);

    return `✅ Dirección guardada.

¿Qué tipo de negocio tienes o emprendimiento realizas?`;
  }

  private pasoNegocio(telefono: string, negocio: string): string {
    const validacion = ValidadorDatos.validarNegocio(negocio);

    if (!validacion.isValid) {
      return validacion.error!;
    }

    this.conversationManager.guardarDato(telefono, 'negocio', negocio);
    this.conversationManager.avanzeStep(telefono);

    return `✅ Negocio registrado.

¿Cuál es tu ingreso mensual aproximado (en soles)?`;
  }

  private pasoIngresos(telefono: string, ingresos: string): string {
    const validacion = ValidadorDatos.validarIngresos(ingresos);

    if (!validacion.isValid) {
      return validacion.error!;
    }

    this.conversationManager.guardarDato(telefono, 'ingresos', ingresos);
    const ingresosNum = parseFloat(ingresos);

    // Sugerir monto basado en ingresos
    const montoSugerido = Math.min(ingresosNum * 0.3, 5000);

    this.conversationManager.avanzeStep(telefono);

    return `✅ Ingresos registrados.

Basado en tus ingresos, puedes solicitar hasta S/ ${montoSugerido.toFixed(2)}.

¿Cuánto dinero deseas solicitar? (S/ 300 - S/ 5,000):`;
  }

  private pasoMonto(telefono: string, monto: string): string {
    const validacion = ValidadorDatos.validarMonto(monto);

    if (!validacion.isValid) {
      return validacion.error!;
    }

    this.conversationManager.guardarDato(telefono, 'monto', monto);
    this.conversationManager.avanzeStep(telefono);

    // Mostrar resumen
    const datos = this.conversationManager.obtenerDatos(telefono);

    return `📋 Resumen de tu solicitud:

👤 Nombre: ${datos.nombre}
🆔 DNI: ${datos.dni}
📱 Teléfono: ${datos.telefono}
🏠 Dirección: ${datos.direccion}
💼 Negocio: ${datos.negocio}
💰 Ingresos: S/ ${datos.ingresos}
📊 Monto solicitado: S/ ${datos.montoSolicitado}

¿Es correcto? Responde SI o NO:`;
  }

  private async pasoConfirmacion(
    telefono: string,
    respuesta: string
  ): Promise<string> {
    if (respuesta === 'si' || respuesta === 'sí' || respuesta === 's') {
      // Guardar en Google Sheets
      const solicitud = this.conversationManager.obtenerSolicitud(telefono);

      if (solicitud) {
        const guardado = await this.googleSheets.guardarSolicitud(solicitud);

        if (guardado) {
          this.conversationManager.reiniciarConversacion(telefono);
          return `✅ ¡Tu solicitud fue registrada correctamente!

📊 Número de solicitud: ${solicitud.dni}
💰 Monto solicitado: S/ ${solicitud.montoSolicitado}
⏳ Estado: Pendiente de revisión

Un agente de Impulso Financiero se pondrá en contacto contigo en las próximas 24 horas para confirmar tu préstamo.

¡Gracias por confiar en nosotros! 🙌`;
        } else {
          return '❌ Hubo un error al guardar tu solicitud. Intenta de nuevo escribiendo "salir" y comenzar nuevamente.';
        }
      }

      return '❌ Error al procesar tu solicitud. Intenta de nuevo.';
    } else if (respuesta === 'no' || respuesta === 'n') {
      this.conversationManager.reiniciarConversacion(telefono);
      return '🔄 Entendido. Conversación reiniciada. ¿Deseas comenzar de nuevo o tienes alguna pregunta?';
    } else {
      return 'Por favor responde SI o NO';
    }
  }

  private async enviarMensaje(remoteJid: string, mensaje: string): Promise<void> {
    if (!this.isConnected) {
      console.log('⚠️  Bot no está conectado. No se puede enviar mensaje.');
      return;
    }

    try {
      await this.sock.sendMessage(remoteJid, {
        text: mensaje,
      });
    } catch (error) {
      console.error('Error enviando mensaje:', error);
    }
  }

  estaConectado(): boolean {
    return this.isConnected;
  }
}
