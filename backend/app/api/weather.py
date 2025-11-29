from app.services.schemas import WeatherResponse, WeatherResponseWithForecast
from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from app.models.open_meteo import geocode_city, fetch_current_weather, fetch_forecast
from pydantic import BaseModel

router = APIRouter()

@router.get("/weather", response_model=WeatherResponse)
async def get_weather(city: str = Query(..., min_length=1)):
    # Buscar coordenadas da cidade
    geo = await geocode_city(city)
    if not geo:
        raise HTTPException(status_code=404, detail=f"City '{city}' not found")

    lat = geo["latitude"]
    lon = geo["longitude"]
    elevation = geo.get("elevation")
    resolved_name = geo.get("name") or city

    # Buscar clima
    weather = await fetch_current_weather(lat, lon)
    if weather is None:
        raise HTTPException(status_code=502, detail="Failed to fetch weather from upstream")

    # Retornar dados no padrão do schema
    return {
        "city": resolved_name,
        "latitude": lat,
        "longitude": lon,
        "elevation": elevation,
        "current_weather": weather,
    }

@router.get("/weather-forecast", response_model=WeatherResponseWithForecast)
async def get_weather_forecast(city: str = Query(..., min_length=1)):
    geo = await geocode_city(city)
    if not geo:
        raise HTTPException(status_code=404, detail=f"City '{city}' not found")

    lat = geo["latitude"]
    lon = geo["longitude"]
    elevation = geo.get("elevation")
    resolved_name = geo.get("name") or city

    current = await fetch_current_weather(lat, lon)
    if current is None:
        raise HTTPException(status_code=502, detail="Failed to fetch current weather")

    forecast = await fetch_forecast(lat, lon, days=7)
    if forecast is None:
        raise HTTPException(status_code=502, detail="Failed to fetch daily forecast")

    return {
        "city": resolved_name,
        "latitude": lat,
        "longitude": lon,
        "elevation": elevation,
        "current_weather": current,
        "daily_forecast": forecast
    }
