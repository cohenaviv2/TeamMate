import axios from "axios";
import moment from "moment";

const API_KEY = process.env.EXPO_PUBLIC_OPEN_TOMMOROWIO_API_KEY;

class WeatherService {
  static async getWeatherByDateAndLocation(date: string, lat: number, lon: number) {
    try {
      const formattedDate = moment(date).format("YYYY-MM-DDTHH:mm:ss");
      const startDateTime = moment(formattedDate).startOf("day").toISOString();

      const response = await axios.get(`https://api.tomorrow.io/v4/timelines`, {
        params: {
          location: `${lat},${lon}`,
          fields: "temperature,weatherCode",
          units: "metric",
          startTime: startDateTime,
          endTime: startDateTime,
          apikey: API_KEY,
        },
        headers: {
          Accept: "application/json",
        },
      });

      const { data } = response.data;
      if (data && data.timelines && data.timelines.length > 0 && data.timelines[0].intervals && data.timelines[0].intervals.length > 0) {
        const temperature = data.timelines[0].intervals[0].values.temperature;
        const weatherCode = data.timelines[0].intervals[0].values.weatherCode;
        return { temp: temperature };
      } else {
        throw new Error("Invalid response format from Tomorrow.io API");
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
      throw error;
    }
  }
}

export default WeatherService;
