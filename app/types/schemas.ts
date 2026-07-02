import { z } from "zod";

const TVMazeShowImageSchema = z
  .object({
    medium: z.string().nullish(),
    original: z.string().nullish(),
  })
  .nullish();

export const TVMazeShowSchema = z.object({
  id: z.number(),
  name: z.string(),
  genres: z.array(z.string()),
  image: TVMazeShowImageSchema,

  premiered: z.string().nullish(),

  rating: z
    .object({
      average: z.number().nullable(),
    })
    .nullish(),

  status: z.string(),
  summary: z.string().nullish(),

  network: z.object({ name: z.string() }).nullish(),
  webChannel: z.object({ name: z.string() }).nullish(),
});

export const TVMazeSearchResultSchema = z.object({
  score: z.number(),
  show: TVMazeShowSchema,
});

export const TVMazeShowArraySchema = z.array(TVMazeShowSchema);
export const TVMazeSearchResultArraySchema = z.array(TVMazeSearchResultSchema);
