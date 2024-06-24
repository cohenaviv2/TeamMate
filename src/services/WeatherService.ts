import { fetchWeatherApi } from "openmeteo";

// Enum to define temperature ranges and their corresponding icons
enum TemperatureIcon {
  COLD = "cold-icon",
  MODERATE = "moderate-icon",
  WARM = "warm-icon",
}

export type TempForcast = { [date: string]: { temperature: number; icon: string } };

class WeatherService {
  private static BASE_URL = "https://api.open-meteo.com/v1/forecast";

  static async getTempForcast(latitude: number, longitude: number): Promise<TempForcast> {
    const params = {
      latitude: latitude,
      longitude: longitude,
      hourly: "temperature_2m",
    };

    try {
      const responses = await fetchWeatherApi(WeatherService.BASE_URL, params);
      const response = responses[0];

      const utcOffsetSeconds = response.utcOffsetSeconds();
      const hourly = response.hourly()!;

      // Helper function to form time ranges
      const range = (start: number, stop: number, step: number) => Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

      const weatherData = {
        hourly: {
          time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
          temperature2m: hourly.variables(0)!.valuesArray()!,
        },
      };

      const timeArray = weatherData.hourly.time;
      const temperatureArray = weatherData.hourly.temperature2m;

      // Parse the time array to extract dates
      const dates = timeArray.map((date) => date.toISOString()).map((time) => time.split("T")[0]);

      // Group temperatures by their respective dates
      const dateTemperatureMap: { [key: string]: number[] } = {};

      dates.forEach((date, index) => {
        if (!dateTemperatureMap[date]) {
          dateTemperatureMap[date] = [];
        }
        dateTemperatureMap[date].push(temperatureArray[index]);
      });

      // Calculate the average temperature for each date and determine icon
      const forecastData: TempForcast = {};

      Object.keys(dateTemperatureMap).forEach((date) => {
        const temperatures = dateTemperatureMap[date];
        const sum = temperatures.reduce((a, b) => a + b, 0);
        const average = sum / temperatures.length;
        forecastData[date] = {
          temperature: Math.floor(average),
          icon: this.getTemperatureIcon(average),
        };
      });

      return forecastData;
    } catch (error: any) {
      console.log(error);
      throw new Error(`Error fetching temperature data: ${error.message}`);
    }
  }

  // Helper method to determine temperature icon based on average temperature
  private static getTemperatureIcon(temperature: number): string {
    if (temperature < 10) {
      return TemperatureIcon.COLD; // Cold icon
    } else if (temperature >= 10 && temperature <= 20) {
      return TemperatureIcon.MODERATE; // Moderate icon
    } else {
      return TemperatureIcon.WARM; // Warm icon
    }
  }
}

export default WeatherService;
