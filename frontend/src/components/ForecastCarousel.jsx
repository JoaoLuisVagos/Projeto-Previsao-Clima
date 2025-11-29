import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import WeatherCard from "./WeatherCard";

export default function ForecastCarousel({ items = [] }) {
  const scroller = useRef(null);
  // Calcula a largura da página para rolagem
  function pageWidth() {
    if (!scroller.current) return 300;
    return Math.floor(scroller.current.clientWidth * 0.85);
  }

  // Rola o carrossel pela quantidade delta
  function scrollBy(delta) {
    if (!scroller.current) return;
    scroller.current.scrollBy({ left: delta, behavior: "smooth" });
  }
  
  // Manipuladores de clique para os botões de navegação
  function onPrev() {
    scrollBy(-pageWidth());
  }

  function onNext() {
    scrollBy(pageWidth());
  }

  return (
    <div className="relative">
      <div className="absolute -left-2 top-1/2 -translate-y-1/2 z-10">
        <button
          aria-label="Mostrar previsões anteriores"
          onClick={onPrev}
          className="bg-white/90 hover:bg-white rounded-full shadow p-2 border border-slate-200"
        >
          <ChevronLeft className="w-5 h-5 text-slate-700" />
        </button>
      </div>

      <div
        ref={scroller}
        className="overflow-x-auto no-scrollbar carousel-focus py-2 px-1 scroll-smooth snap-x snap-mandatory flex gap-4 touch-pan-x"
        role="list"
        aria-label="Previsão dos próximos dias"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") onPrev();
          if (e.key === "ArrowRight") onNext();
        }}
      >
        {items.map((day, i) => (
          <div
            key={i}
            role="listitem"
            className="snap-start flex-shrink-0 w-[220px] sm:w-[240px] md:w-[260px] lg:w-[300px] h-[300px] sm:h-[300px] md:h-[320px] lg:h-[360px]"
          >
            {/* Renderiza o WeatherCard para cada dia da previsão */}
            <WeatherCard
              title={day.formattedDate ? day.formattedDate : day.date}
              code={day.weathercode}
              temperature={day.temperature}
              compact={true}
              fillHeight={true}
              details={day.details || []}
            />
          </div>
        ))}
      </div>

      <div className="absolute -right-2 top-1/2 -translate-y-1/2 z-10">
        <button
          aria-label="Mostrar próximas previsões"
          onClick={onNext}
          className="bg-white/90 hover:bg-white rounded-full shadow p-2 border border-slate-200"
        >
          <ChevronRight className="w-5 h-5 text-slate-700" />
        </button>
      </div>
    </div>
  );
}
