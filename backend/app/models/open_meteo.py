import httpx

GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search"
WEATHER_URL = "https://api.open-meteo.com/v1/forecast"

async def geocode_city(city: str):
    """Pega as coordenadas de uma cidade pelo nome."""
    async with httpx.AsyncClient() as client:
        params = {"name": city, "count": 1, "language": "pt", "format": "json"}
        response = await client.get(GEOCODE_URL, params=params)
        data = response.json()

    if "results" not in data or not data["results"]:
        return None

    return data["results"][0]


async def fetch_current_weather(lat: float, lon: float):
    """Pega o clima atual."""
    async with httpx.AsyncClient() as client:
        params = {
            "latitude": lat,
            "longitude": lon,
            "current": "temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,wind_direction_10m",
            "timezone": "America/Sao_Paulo",
        }
        response = await client.get(WEATHER_URL, params=params)
        data = response.json()

    return data.get("current")

async def fetch_forecast(lat: float, lon: float, days: int = 7):
    """Pega a previsão para 7 dias para uma dada latitude/longitude."""
    async with httpx.AsyncClient() as client:
        params = {
            "latitude": lat,
            "longitude": lon,
            "daily": "temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode,wind_speed_10m_max,wind_direction_10m_dominant",
            "forecast_days": days,
            "timezone": "America/Sao_Paulo",
        }
        response = await client.get(WEATHER_URL, params=params)
        data = response.json()
    return data.get("daily")
