import { useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Componente FAQ - Preguntas Frecuentes
 * Diseño: Confianza Local Moderna
 * Acordeón interactivo con animaciones suaves
 */

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
}

export default function FAQ({ items }: FAQProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="border border-border rounded-lg overflow-hidden transition-all hover:border-primary/50"
        >
          <button
            onClick={() => toggleFAQ(item.id)}
            className="w-full px-6 py-4 flex items-center justify-between bg-card hover:bg-card/80 transition-colors text-left"
          >
            <span className="font-semibold text-foreground pr-4">{item.question}</span>
            <ChevronDown
              size={20}
              className={`flex-shrink-0 text-primary transition-transform duration-300 ${
                openId === item.id ? "rotate-180" : ""
              }`}
            />
          </button>

          {openId === item.id && (
            <div className="px-6 py-4 bg-background border-t border-border animate-in fade-in duration-200">
              <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
