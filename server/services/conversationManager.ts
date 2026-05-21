import {
  ConversationState,
  ConversationStep,
  SolicitudPrestamo,
  ValidationResult,
} from '../../shared/types.js';

export class ConversationManager {
  private conversaciones: Map<string, ConversationState> = new Map();

  obtenerConversacion(telefono: string): ConversationState {
    if (!this.conversaciones.has(telefono)) {
      this.conversaciones.set(telefono, {
        userId: telefono,
        telefono,
        step: 'inicio',
        data: {},
        ultimaActualizacion: new Date(),
      });
    }
    return this.conversaciones.get(telefono)!;
  }

  avanzeStep(telefono: string): ConversationStep {
    const conv = this.obtenerConversacion(telefono);
    const pasos: ConversationStep[] = [
      'inicio',
      'nombre',
      'dni',
      'telefono',
      'direccion',
      'negocio',
      'ingresos',
      'monto',
      'confirmacion',
      'completada',
    ];

    const indiceActual = pasos.indexOf(conv.step);
    if (indiceActual < pasos.length - 1) {
      conv.step = pasos[indiceActual + 1];
      conv.ultimaActualizacion = new Date();
      this.conversaciones.set(telefono, conv);
    }

    return conv.step;
  }

  guardarDato(telefono: string, campo: string, valor: any): void {
    const conv = this.obtenerConversacion(telefono);
    if (campo === 'nombre') conv.data.nombre = valor;
    else if (campo === 'dni') conv.data.dni = valor;
    else if (campo === 'telefono') conv.data.telefono = valor;
    else if (campo === 'direccion') conv.data.direccion = valor;
    else if (campo === 'negocio') conv.data.negocio = valor;
    else if (campo === 'ingresos') conv.data.ingresos = parseFloat(valor) || 0;
    else if (campo === 'monto') conv.data.montoSolicitado = parseFloat(valor) || 0;

    conv.ultimaActualizacion = new Date();
    this.conversaciones.set(telefono, conv);
  }

  obtenerDatos(telefono: string): Partial<SolicitudPrestamo> {
    const conv = this.obtenerConversacion(telefono);
    return conv.data;
  }

  reiniciarConversacion(telefono: string): void {
    this.conversaciones.delete(telefono);
  }

  obtenerSolicitud(telefono: string): SolicitudPrestamo | null {
    const conv = this.obtenerConversacion(telefono);
    if (!conv.data.nombre || !conv.data.dni) return null;

    return {
      fecha: new Date(),
      nombre: conv.data.nombre!,
      dni: conv.data.dni!,
      telefono: conv.data.telefono || telefono,
      direccion: conv.data.direccion || '',
      negocio: conv.data.negocio || '',
      ingresos: conv.data.ingresos || 0,
      montoSolicitado: conv.data.montoSolicitado || 0,
      estado: 'pendiente',
    };
  }
}

// Validadores
export class ValidadorDatos {
  static validarNombre(nombre: string): ValidationResult {
    if (!nombre || nombre.trim().length < 3) {
      return {
        isValid: false,
        error: 'Por favor ingresa un nombre válido (mínimo 3 caracteres)',
      };
    }
    return { isValid: true };
  }

  static validarDNI(dni: string): ValidationResult {
    // DNI peruano: 8 dígitos
    const dniRegex = /^\d{8}$/;
    if (!dniRegex.test(dni)) {
      return {
        isValid: false,
        error: 'El DNI debe tener 8 dígitos',
      };
    }
    return { isValid: true };
  }

  static validarTelefono(telefono: string): ValidationResult {
    // Teléfono peruano: +51 o 9 seguido de números
    const telRegex = /^(\+51|51)?9\d{8}$/;
    const telefonoLimpio = telefono.replace(/[\s\-\(\)]/g, '');
    if (!telRegex.test(telefonoLimpio)) {
      return {
        isValid: false,
        error: 'Ingresa un teléfono válido (9XXXXXXXX)',
      };
    }
    return { isValid: true };
  }

  static validarDireccion(direccion: string): ValidationResult {
    if (!direccion || direccion.trim().length < 5) {
      return {
        isValid: false,
        error: 'Por favor ingresa una dirección válida',
      };
    }
    return { isValid: true };
  }

  static validarNegocio(negocio: string): ValidationResult {
    if (!negocio || negocio.trim().length < 3) {
      return {
        isValid: false,
        error: 'Describe tu negocio (mínimo 3 caracteres)',
      };
    }
    return { isValid: true };
  }

  static validarIngresos(ingresos: string): ValidationResult {
    const ingresosNum = parseFloat(ingresos);
    if (isNaN(ingresosNum) || ingresosNum < 0) {
      return {
        isValid: false,
        error: 'Ingresa un monto válido de ingresos mensuales',
      };
    }
    return { isValid: true };
  }

  static validarMonto(monto: string): ValidationResult {
    const montoNum = parseFloat(monto);
    if (isNaN(montoNum) || montoNum < 300 || montoNum > 5000) {
      return {
        isValid: false,
        error: 'El monto debe estar entre S/ 300 y S/ 5,000',
      };
    }
    return { isValid: true };
  }
}
