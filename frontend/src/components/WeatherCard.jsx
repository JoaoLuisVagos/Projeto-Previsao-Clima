import { motion } from "framer-motion";
import { Sun, Cloud, CloudRain, Wind, Snowflake, CloudSun, Droplet, Thermometer, Clock } from "lucide-react";

// Ícones de clima baseados no código fornecido pela API
const icons = {
  clear: <Sun className="w-12 h-12" />,
  cloudy: <Cloud className="w-12 h-12" />,
  partly_cloudy: <CloudSun className="w-12 h-12" />,
  rain: <CloudRain className="w-12 h-12" />,
  wind: <Wind className="w-12 h-12" />,
  snow: <Snowflake className="w-12 h-12" />,
};

// Função para obter o ícone correto com base no código do clima
export function getIconFromCode(code) {
  if (code === 0) return icons.clear;
  if (code <= 2) return icons.partly_cloudy;
  if (code <= 45) return icons.cloudy;
  if (code <= 67) return icons.rain;
  if (code <= 86) return icons.snow;
  return icons.wind;
}

// Função para obter ícone de detalhe com base no rótulo
function getDetailIcon(label) {
  if (!label) return <div className="w-4 h-4" />;
  const text = String(label).toLowerCase();
  if (text.includes("chuva") || text.includes("rain") || text.includes("precip")) return <CloudRain className="w-4 h-4" />;
  if (text.includes("umid") || text.includes("humidity")) return <Droplet className="w-4 h-4" />;
  if (text.includes("vento") || text.includes("wind")) return <Wind className="w-4 h-4" />;
  if (text.includes("hora") || text.includes("time")) return <Clock className="w-4 h-4" />;
  if (text.includes("máx") || text.includes("max") || text.includes("mín") || text.includes("min") || text.includes("temp")) return <Thermometer className="w-4 h-4" />;
  // fallback
  return <div className="w-4 h-4" />;
}

export default function WeatherCard({ title, code, temperature, details = [], compact = false, fillHeight = false }) {
  const irrigationAdvice = (() => {
    // Pequena dica agrícola amigável — apenas heurística
    const rain = details.find((d) => /chuva|rain|precipitation/i.test(d.label))?.value;
    const humidity = details.find((d) => /umid|humidity/i.test(d.label))?.value;
    const t = Number(String(temperature).replace(/[^0-9.-]/g, ""));

    const rainNum = rain ? Number(String(rain).replace(/[^0-9.\-]/g, "")) : null;
    const humidityNum = humidity ? Number(String(humidity).replace(/[^0-9.\-]/g, "")) : null;

    if (rainNum !== null && rainNum >= 5) return { label: 'Situação', value: 'Boa (chuva suficiente)', tone: 'green' };
    if (t >= 30 && (!rainNum || rainNum < 1)) return { label: 'Irrigação', value: 'Recomendada', tone: 'amber' };
    if (humidityNum !== null && humidityNum < 40) return { label: 'Alerta', value: 'Baixa umidade', tone: 'amber' };
    return { label: 'Situação', value: 'Normal', tone: 'green' };
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg flex flex-col items-stretch w-full border border-slate-200 dark:border-slate-800 ${compact ? 'min-h-0 p-2 pb-3 h-auto self-start overflow-hidden' : 'p-6 h-full justify-between overflow-hidden'} ${fillHeight ? 'h-full justify-between' : ''}`}
    >
      <div className={`flex items-start gap-4 ${compact ? '' : 'h-full'} ${fillHeight ? 'h-full' : ''}`}>
        <div className={`flex-shrink-0 bg-emerald-50 rounded-xl ${compact ? 'p-2' : 'p-3'}`}>
          <div className={`${compact ? 'w-10 h-10' : 'w-16 h-16'} rounded-lg bg-gradient-to-tr from-emerald-300/60 to-amber-200/30 flex items-center justify-center`}>{getIconFromCode(code)}</div>
        </div>

        <div className={`flex-1 min-h-0 flex flex-col ${compact ? 'justify-start' : 'justify-between h-full'} ${fillHeight ? 'justify-between h-full' : ''}`}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col">
                  <h3 className={`${compact ? 'text-sm' : 'text-lg'} font-semibold leading-snug`}>{title}</h3>
              {!compact && (
                <span className="text-sm text-slate-600">Previsão voltada para produtividade agrícola</span>
              )}
            </div>

            <div className="text-right">
              <div className={`${compact ? 'text-xl' : 'text-3xl'} font-extrabold text-slate-900 flex items-center gap-2 justify-end`}>
                <Thermometer className="w-5 h-5 text-amber-600" />
                <span>{temperature}°C</span>
              </div>
              <div className="text-xs text-slate-500">Temperatura média estimada</div>
            </div>
          </div>
          {/* Detalhes completos exibidos apenas na versão não compacta */}
          {!compact && (
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-700 max-h-28 overflow-hidden">
              {details?.map((d, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/60 border border-slate-100 min-h-[52px]">
                  <div className="text-slate-400 w-7 h-7 flex items-center justify-center">{getDetailIcon(d.label)}</div>
                  <div className="flex-1">
                    <div className="text-xs text-slate-500 font-medium">{d.label}</div>
                    <div className="text-sm font-semibold break-words">{d.value}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Versão compacta mostra apenas os 3 primeiros detalhes */}
          {compact && (
            <div className="mt-2 grid grid-cols-1 gap-1 text-sm text-slate-700 min-h-0 overflow-hidden">
              {details?.slice(0,3).map((d, i) => (
                <div key={i} className="flex items-center gap-2 px-2 py-0.5 rounded-lg bg-white/60 border border-slate-100" style={{minHeight: '20px'}}>
                  <div className="text-slate-400 w-6 h-6 flex items-center justify-center">{getDetailIcon(d.label)}</div>
                  <div className="flex-1">
                    <div className="text-xs text-slate-500 font-medium truncate">{d.label}</div>
                    <div className="text-sm font-semibold truncate">{d.value}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className={`${compact ? 'mt-1' : 'mt-4'} flex items-center justify-between gap-4`}> 
            <div className={`inline-flex items-center gap-2 ${compact ? 'px-2 py-1 text-[11px] w-full justify-center whitespace-normal' : 'px-3 py-2 text-xs'} rounded-full font-semibold ${irrigationAdvice.tone === 'green' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
              <span className="px-1">{irrigationAdvice.label}:</span>
              <span className="px-1 break-words">{irrigationAdvice.value}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
