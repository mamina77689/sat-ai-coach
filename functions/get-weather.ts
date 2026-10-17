import { GetWeatherArgs } from "../zod-schema/get-weather-args";


export const getWeather =  async (args: GetWeatherArgs) => {
    const response = {
        cityName: args.city,
        unit: args.unit,
        temperature: 22
    }

    return response
}