import { Tool } from "@google/genai";

import { getWeatherTool } from "./get-weather-tool";
import { getWeather } from "../functions/get-weather";
import { getWeatherSchema } from "../zod-schema/get-weather-args";

export const ALL_TOOLS: Tool[] = [
    {
 
    functionDeclarations: [getWeatherTool]
  }
]

export const TOOL_IMPLEMENTATIONS: Record<string, any>  = {
    get_weather: getWeather
}

export const TOOL_ARGS: Record<string, any> =  {
    get_weather: getWeatherSchema
}