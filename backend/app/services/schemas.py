from pydantic import BaseModel
from typing import Optional, Dict

class CurrentWeather(BaseModel):
    temperature: float
    windspeed: float
    winddirection: float
    weathercode: int
    time: str

class WeatherResponse(BaseModel):
    city: str
    latitude: float
    longitude: float
    elevation: Optional[float]
    current_weather: CurrentWeather

class WeatherResponseWithForecast(BaseModel):
    city: str
    latitude: float
    longitude: float
    elevation: Optional[float] = None
    current_weather: dict
    daily_forecast: Optional[dict] = None