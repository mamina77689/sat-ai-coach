import { FunctionDeclaration } from "@google/genai";
import * as z from 'zod'
import { getWeatherSchema } from "../zod-schema/get-weather-args";


export const getWeatherTool:FunctionDeclaration = {
    name: 'get_weather',
    description: 'Цаг агаарын мэдээ өгдөг function calling tool',
    parameters: z.toJSONSchema(getWeatherSchema) as FunctionDeclaration['parameters']
}