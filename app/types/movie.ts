import { z } from "zod";

import { TVMazeSearchResultSchema, TVMazeShowSchema } from "./schemas";

export interface ShowFilters {
  title?: string;
  genre?: string;
  page?: number;
  limit?: number;
}

export type TVMazeShow = z.infer<typeof TVMazeShowSchema>;
export type TVMazeSearchResult = z.infer<typeof TVMazeSearchResultSchema>;
