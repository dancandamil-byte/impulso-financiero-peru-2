import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Send } from "lucide-react";

/**
 * Componente PreSolicitudModal
 * Formulario modal para capturar datos de pre-solicitud
 * Envía información directamente a WhatsApp
 */

interface PreSolicitudModalProps {
  isOpen: boolean;
  onClose: () => void;
  whatsappNumber: string;
}

export default function PreSolicitudModal({
  isOpen,
  onClose,
  whatsappNumber,
}: PreSolicitudModalProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    dni: "",
    monto: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que todos los campos estén llenos
    if (!formData.nombre || !formData.dni || !formData.monto) {
      alert("Por favor completa todos los campos");
      return;
    }

    setIsSubmitting(true);

    // Construir el mensaje para WhatsApp
    const message = encodeURIComponent(
      `Hola, me interesa solicitar un microcrédito con los siguientes datos:\n\n` +
        `👤 Nombre: ${formData.nombre}\n` +
        `🆔 DNI: ${formData.dni}\n` +
        `💰 Monto solicitado: S/ ${formData.monto}\n\n` +
        `Por favor, contactarme para más información.`
    );

    // Abrir WhatsApp con el mensaje
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");

    // Limpiar formulario y cerrar modal
    setFormData({ nombre: "", dni: "", monto: "" });
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in fade-in zoom-in-95 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-accent p-6 rounded-t-2xl flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Pre-solicitud rápida</h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-1 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Completa tus datos y nos contactaremos por WhatsApp para procesar tu solicitud.
            </p>

            {/* Campo Nombre */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Nombre completo
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Juan Pérez"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            {/* Campo DNI */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                DNI
              </label>
              <input
                type="text"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                placeholder="Ej: 12345678"
                maxLength={8}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            {/* Campo Monto */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Monto que necesitas (S/)
              </label>
              <input
                type="number"
                name="monto"
                value={formData.monto}
                onChange={handleChange}
                placeholder="Ej: 1000"
                min="300"
                max="5000"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Rango: S/ 300 - S/ 5,000
              </p>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-primary hover:bg-primary/90 text-white gap-2"
              >
                <Send size={18} />
                {isSubmitting ? "Enviando..." : "Enviar por WhatsApp"}
              </Button>
            </div>
          </form>

          {/* Footer */}
          <div className="bg-card px-6 py-3 rounded-b-2xl border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Tus datos están seguros. Solo se usarán para procesar tu solicitud.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
