import * as z from 'zod'

const unit = ['F', 'C']
export type UnitEnum = typeof unit[number]


export const getWeatherSchema = z.object({
    city: z.string().describe("It should be city name"),
    unit: z.enum(unit).describe("Weather unit")
})

export type GetWeatherArgs = z.infer<typeof getWeatherSchema>