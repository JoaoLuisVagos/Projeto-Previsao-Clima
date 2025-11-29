import { useState } from "react";
import WeatherCard, { getIconFromCode } from "../components/WeatherCard";
import ForecastCarousel from "../components/ForecastCarousel";

export default function Home() {
  const [city, setCity] = useState("");
  const [currentCity, setCurrentCity] = useState("");
  const [data, setData] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function search(e) {
    e?.preventDefault();
    if (!city) return;

    setLoading(true);
    setError(null);
    setData(null);
    setForecast(null);

    try {

      // Busca dados do clima na API backend
      const res = await fetch(
        `http://localhost:8000/api/weather-forecast?city=${encodeURIComponent(city)}`
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Erro ao buscar clima");
      }

      const json = await res.json();

      setData(json.current_weather);
      setCurrentCity(city);
      const fc = json.daily_forecast;

      // Normaliza dados diários
      const normalized = fc.time.map((date, i) => {
        const max = fc.temperature_2m_max[i];
        const min = fc.temperature_2m_min[i];
        const avg = Math.round((max + min) / 2);
        return {
          date,
          max,
          min,
          avg,
          temperature: avg,
          rain: fc.precipitation_sum[i],
          wind: fc.wind_speed_10m ? fc.wind_speed_10m[i] : null,
          weathercode: fc.weathercode[i],
          details: [
            { label: "Máx", value: max + "°C" },
            { label: "Mín", value: min + "°C" },
            { label: "Chuva", value: (fc.precipitation_sum[i] ?? 0) + " mm" },
            { label: "Vento", value: (fc.wind_speed_10m ? fc.wind_speed_10m[i] : "-") + " km/h" },
          ],
        };
      });

      setForecast(normalized);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Componente para exibir uma métrica rápida
  function Metric({ label, value }) {
    return (
      <div className="bg-white/60 border border-slate-100 rounded-lg px-3 py-2 flex flex-col items-start">
        <div className="text-xs text-slate-500">{label}</div>
        <div className="text-md font-semibold text-slate-800">{value}</div>
      </div>
    );
  }

  // Formata data para exibição amigável
  function formatDate(dateStr) {
    try {
      const d = new Date(dateStr + "T00:00:00");
      return d.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" });
    } catch {
      return dateStr;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50 to-sky-50 py-10">
      <div className="max-w-5xl mx-auto px-6">
        <header className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="rounded-xl bg-emerald-600/10 p-2 text-2xl">🌾</div>
            <h1 className="text-4xl font-extrabold text-slate-900">AgroClima — Previsão agrícola inteligente</h1>
          </div>
          <p className="text-slate-600 max-w-2xl mx-auto">Informações meteorológicas voltadas para produtores — com recomendações simples para irrigação e manejo.</p>
        </header>

        <form onSubmit={search} className="flex justify-center gap-3 mb-6" role="search" aria-label="Busca de cidade">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Ex.: Ribeirão Preto, Brasil"
            className="border rounded-xl p-3 w-96 shadow focus:ring-2 focus:ring-emerald-200"
          />
          <button
            type="submit" aria-label="Buscar clima para a cidade"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl shadow-md"
          >
            Buscar
          </button>
        </form>

        {loading && <p className="text-center">Carregando...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        {data && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
                <WeatherCard
                  title={`Clima Atual — ${currentCity || city}`}
                  code={data.weathercode ?? data.weather_code ?? data.weatherCode}
                  temperature={data.temperature_2m ?? data.temperature}
                  details={[
                    { label: "Vento", value: (data.wind_speed_10m ?? data.windspeed ?? data.windSpeed ?? null) ? ((data.wind_speed_10m ?? data.windspeed ?? data.windSpeed) + " km/h") : "N/A" },
                    { label: "Direção", value: (() => {
                        const dir = data.wind_direction_10m ?? data.winddirection ?? data.windDirection ?? null;
                        return (dir === null || dir === undefined || dir === "") ? "N/A" : (Number.isFinite(Number(dir)) ? `${dir}°` : String(dir));
                      })()
                    },
                    { label: "Hora (UTC)", value: (() => {
                        try {
                          const t = new Date(data.time);
                          return isNaN(t.getTime()) ? data.time : t.toLocaleString("pt-BR", { hour: "2-digit", minute: "2-digit" });
                        } catch (e) { return data.time; }
                      })()
                    },
                    { label: "Umidade", value: (data.relative_humidity_2m ?? data.relativeHumidity ?? "-") + "%" },
                  ]}
                />

              {forecast && (
                <section className="mt-6">
                  <h2 className="text-lg font-semibold mb-3 text-slate-800">Previsão | Próximos dias</h2>
                  <ForecastCarousel
                    items={forecast.map((d) => ({
                      ...d,
                      formattedDate: formatDate(d.date),
                    }))}
                  />
                </section>
              )}
            </div>

            <aside className="lg:col-span-1 space-y-4">
              <div className="bg-white/80 p-4 rounded-2xl shadow-md border border-slate-100">
                <div className="mb-2 text-sm font-semibold text-slate-700">Resumo rápido</div>
                <div className="grid grid-cols-2 gap-3">
                  <Metric label="Umidade" value={(data.relative_humidity_2m ?? "-") + "%"} />
                  <Metric label="Vento" value={(data.wind_speed_10m ?? "-") + " km/h"} />
                  <Metric label="Precipitação" value={(forecast?.[0]?.rain ?? 0) + " mm/dia"} />
                  <Metric label="Temperatura" value={data.temperature_2m + "°C"} />
                </div>
              </div>

              <div className="bg-white/90 p-4 rounded-2xl shadow-md border border-slate-100">
                <div className="text-sm font-semibold mb-2">Conselho agrícola</div>
                <div className="text-sm text-slate-700 leading-relaxed">
                  Com base nos dados atuais, verifique a necessidade de irrigação nos próximos 2 dias — se chuvas forem inferiores a 3 mm e temperatura média estiver acima de 28°C, planeje irrigação preventiva.
                </div>
              </div>

            </aside>
          </div>
        )}

        {!data && (
          <div className="mt-8 text-center text-slate-600">Pesquise uma cidade acima para começar. Ex.: Ribeirão Preto, Piracicaba, São Paulo</div>
        )}
      </div>
    </div>
  );
}
