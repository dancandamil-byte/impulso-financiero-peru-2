import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, DollarSign, Clock, FileText, Users, MessageCircle, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import FAQ from "@/components/FAQ";
import PreSolicitudModal from "@/components/PreSolicitudModal";

/**
 * Impulso Financiero Perú - Landing Page
 * Diseño: Confianza Local Moderna
 * Colores: Verde #2E7D32, Oro #FBC02D, Azul #1A237E
 * Tipografía: Montserrat (títulos), Open Sans (cuerpo)
 */

export default function Home() {
  const [whatsappNumber] = useState("573180941369");
  const [isPreSolicitudOpen, setIsPreSolicitudOpen] = useState(false); // +51 997 650 222

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      "Hola, me interesa conocer más sobre los microcréditos de Impulso Financiero Perú."
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">I</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-primary">Impulso Financiero</h1>
              <p className="text-xs text-muted-foreground">Perú</p>
            </div>
          </div>
          <Button
            onClick={handleWhatsAppClick}
            className="bg-primary hover:bg-primary/90 text-white gap-2"
          >
            <MessageCircle size={18} />
            Contactar
          </Button>
        </div>
      </header>

      {/* Hero Section - Asimétrico */}
      <section className="relative overflow-hidden">
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-8 py-12 lg:py-20 items-center">
          {/* Contenido izquierdo */}
          <div className="space-y-6 z-10">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-bold text-primary leading-tight">
                Microcréditos que impulsan
                <span className="text-accent block italic font-light">tus sueños</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Crece tu negocio en Iquitos con capital rápido, sin aval y sin burocracia. Aprobación en 24 horas.
              </p>
            </div>

            {/* Números clave */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="bg-card p-4 rounded-lg border border-border">
                <p className="text-2xl font-bold text-accent">S/200-1,000</p>
                <p className="text-xs text-muted-foreground">Montos disponibles</p>
              </div>
              <div className="bg-card p-4 rounded-lg border border-border">
                <p className="text-2xl font-bold text-accent">24h</p>
                <p className="text-xs text-muted-foreground">Aprobación rápida</p>
              </div>
              <div className="bg-card p-4 rounded-lg border border-border">
                <p className="text-2xl font-bold text-accent">0%</p>
                <p className="text-xs text-muted-foreground">Sin aval</p>
              </div>
            </div>

            {/* CTA Principal */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleWhatsAppClick}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white gap-2 flex-1"
              >
                <MessageCircle size={20} />
                Consultar por WhatsApp
              </Button>
              <Button
                onClick={() => setIsPreSolicitudOpen(true)}
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary/5"
              >
                Pre-solicitud rápida
              </Button>
            </div>

            {/* Ubicación */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin size={16} className="text-primary" />
              <span>Iquitos, Punchana, Belén y alrededores</span>
            </div>
          </div>

          {/* Imagen derecha */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl" />
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663658702260/5Q56g2pjCisYgsmH6KWU36/hero_impulso_iquitos-83stBygLgvXmqbnaKiXVjN.webp"
              alt="Emprendedor en Iquitos"
              className="rounded-2xl shadow-lg object-cover w-full h-96"
            />
          </div>
        </div>

        {/* Flecha decorativa */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-30" />
      </section>

      {/* Sección: Cómo funciona */}
      <section className="py-16 bg-card border-t border-border">
        <div className="container">
          <h2 className="text-3xl font-bold text-center text-primary mb-12">
            Proceso simple en 3 pasos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: FileText,
                title: "Consulta",
                description: "Cuéntanos tu necesidad y te asesoramos sin compromiso",
              },
              {
                icon: CheckCircle2,
                title: "Evaluación",
                description: "Evaluamos tu perfil de forma rápida y segura",
              },
              {
                icon: DollarSign,
                title: "Aprobación",
                description: "Recibe tu capital en 24-48 horas",
              },
            ].map((step, idx) => (
              <div key={idx} className="relative">
                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <step.icon size={32} className="text-primary" />
                    </div>
                  </div>
                  <h3 className="font-bold text-lg text-primary mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </Card>
                {idx < 2 && (
                  <div className="hidden md:flex absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight size={24} className="text-accent" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección: Requisitos */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-primary mb-8">¿Qué necesitas?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-secondary mb-6">Requisitos mínimos</h3>
              {[
                "DNI vigente",
                "Comprobante de domicilio (luz, agua, cable)",
                "Ser mayor de 18 años",
                "Tener actividad económica o negocio",
              ].map((req, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <CheckCircle2 size={20} className="text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">{req}</span>
                </div>
              ))}
            </div>

            <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <h3 className="font-bold text-lg text-primary mb-4">Montos y plazos</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-muted-foreground">Monto mínimo</span>
                  <span className="font-bold text-primary">S/ 200</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-muted-foreground">Monto máximo</span>
                  <span className="font-bold text-primary">S/ 1,000</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-muted-foreground">Plazo</span>
                  <span className="font-bold text-primary">Flexible</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Aprobación</span>
                  <span className="font-bold text-primary">24-48 horas</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Sección: Testimonios */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container">
          <h2 className="text-3xl font-bold text-center text-primary mb-12">
            Historias de éxito
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Rosa",
                location: "Mercado Belén",
                story: "Necesitaba S/800 para surtir mi puesto de juane. En Impulso me aprobaron en un día y ahora vendo el doble.",
              },
              {
                name: "José",
                location: "Punchana",
                story: "De vendedor ambulante a dueño de bodega. Con S/2,000 de Impulso cambié mi vida y ahora tengo 2 empleados.",
              },
              {
                name: "María",
                location: "Iquitos Centro",
                story: "Expandí mi tienda de ropa sin aval. El proceso fue rápido y transparente. Muy recomendado.",
              },
            ].map((testimonial, idx) => (
              <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-accent">★</span>
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">"{testimonial.story}"</p>
                <div>
                  <p className="font-bold text-primary">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>      {/* Sección: Preguntas Frecuentes */}
      <section className="py-16 bg-card border-t border-border">
        <div className="container">
          <h2 className="text-3xl font-bold text-center text-primary mb-12">
            Preguntas frecuentes
          </h2>

          <div className="max-w-3xl mx-auto">
            <FAQ
              items={[
                {
                  id: "req-1",
                  question: "¿Cuáles son los requisitos principales para solicitar un crédito?",
                  answer: "Necesitas ser mayor de 18 años, tener un DNI vigente, comprobante de domicilio (recibo de luz, agua o cable), y demostrar que tienes una actividad económica o negocio. No se requiere aval ni garantía hipotecaria.",
                },
                {
                  id: "req-2",
                  question: "¿Qué documentos debo presentar?",
                  answer: "Principalmente tu DNI, un comprobante de domicilio de los últimos 3 meses, y si es posible, documentos que demuestren tu actividad económica (facturas, recibos de ventas, o declaración jurada). Todo se puede hacer por WhatsApp.",
                },
                {
                  id: "proc-1",
                  question: "¿Cuánto tiempo tarda la aprobación?",
                  answer: "Generalmente entre 24 a 48 horas. Contactas por WhatsApp, envías tus documentos, nuestro equipo evalúa tu perfil, y si todo está correcto, recibes tu capital en tu cuenta bancaria o en efectivo según tu preferencia.",
                },
                {
                  id: "proc-2",
                  question: "¿Cómo es el proceso de solicitud?",
                  answer: "Es muy simple: 1) Escríbenos por WhatsApp con tu consulta, 2) Te enviamos un formulario rápido para llenar, 3) Envías tus documentos por WhatsApp o en persona, 4) Evaluamos tu solicitud, 5) Si es aprobada, recibes tu dinero. Todo sin burocracia.",
                },
                {
                  id: "mon-1",
                  question: "¿Cuáles son los montos disponibles?",
                  answer: "Ofrecemos créditos desde S/ 200 hasta S/ 1,000. El monto depende de tu capacidad de pago y la evaluación de tu perfil. Podemos hacer créditos mayores en casos especiales, consulta con nuestro equipo.",
                },
                {
                  id: "mon-2",
                  question: "¿Cuál es la tasa de interés?",
                  answer: "Las tasas varían según el monto y plazo del crédito. Te damos una propuesta personalizada después de evaluar tu solicitud. Somos transparentes: no hay costos ocultos ni sorpresas. Consulta directamente por WhatsApp para conocer la tasa exacta para tu caso.",
                },
                {
                  id: "pag-1",
                  question: "¿Cuáles son las opciones de pago?",
                  answer: "Puedes elegir el plazo que mejor se adapte a tu negocio: desde 1 mes hasta 12 meses. Los pagos pueden ser semanales, quincenales o mensuales. Trabajamos con tu flujo de caja para que sea manejable.",
                },
                {
                  id: "pag-2",
                  question: "¿Qué pasa si tengo dificultades para pagar?",
                  answer: "Entendemos que los negocios tienen altibajos. Si tienes problemas para pagar, contacta inmediatamente con nuestro equipo. Podemos renegociar el plazo, hacer reestructuraciones o buscar soluciones que funcionen para ti. Preferimos trabajar juntos que generar conflictos.",
                },
                {
                  id: "seg-1",
                  question: "¿Es seguro compartir mis documentos por WhatsApp?",
                  answer: "Sí, es seguro. Usamos WhatsApp Business que tiene encriptación de extremo a extremo. Tus documentos están protegidos. Si prefieres, también puedes venir en persona a nuestras oficinas en Iquitos para entregar todo directamente.",
                },
                {
                  id: "seg-2",
                  question: "¿Debo pagar algo por adelantado?",
                  answer: "No. Impulso Financiero Perú no cobra nada por adelantado. No hay comisiones de solicitud, evaluación ni desembolso. Solo pagas intereses sobre el monto que recibas, según lo acordado. Somos transparentes en nuestros costos.",
                },
              ]}
            />
          </div>
        </div>
      </section>



      {/* Sección: CTA Final */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container text-center space-y-6">
          <h2 className="text-3xl lg:text-4xl font-bold">
            ¿Listo para impulsar tu negocio?
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Contáctanos hoy por WhatsApp y obtén una consulta personalizada sin compromiso.
          </p>
          <Button
            onClick={handleWhatsAppClick}
            size="lg"
            className="bg-accent hover:bg-accent/90 text-secondary gap-2 mx-auto"
          >
            <MessageCircle size={20} />
            Escribir a WhatsApp
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-white py-8 border-t border-border">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-3">Impulso Financiero Perú</h3>
              <p className="text-sm opacity-80">
                Microcréditos rápidos y seguros para emprendedores de Iquitos.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-3">Contacto</h3>
              <div className="space-y-2 text-sm opacity-80">
                <div className="flex gap-2 items-center">
                  <MessageCircle size={16} />
                  <span>WhatsApp: +57 318 094 1369</span>
                </div>
                <div className="flex gap-2 items-center">
                  <MapPin size={16} />
                  <span>Iquitos, Loreto, Perú</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-3">Horario</h3>
              <p className="text-sm opacity-80">
                Lunes a Sábado: 8:00 AM - 6:00 PM<br />
                WhatsApp 24/7
              </p>
            </div>
          </div>
          <div className="border-t border-white/20 pt-6 text-center text-sm opacity-70">
            <p>© 2026 Impulso Financiero Perú. Todos los derechos reservados.</p>
            <p className="mt-2">
              Las condiciones de crédito están sujetas a evaluación. Protegemos tus datos según la Ley N° 29733.
            </p>
          </div>
        </div>
      </footer>      {/* Pre-solicitud Modal */}
      <PreSolicitudModal
        isOpen={isPreSolicitudOpen}
        onClose={() => setIsPreSolicitudOpen(false)}
        whatsappNumber={whatsappNumber}
      />

      

      {/* Botón flotante WhatsApp */}
      <button
        onClick={handleWhatsAppClick}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-40"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle size={24} />
      </button>
    </div>
  );
}
