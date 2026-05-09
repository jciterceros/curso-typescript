import { z } from "zod";

export const numberFromInputSchema = (min: number, max: number) =>
  z.preprocess((value) => {
    if (value === undefined) return undefined;
    if (typeof value === "string" && value.trim() === "") return Number.NaN;
    return Number(value);
  }, z.number().int().min(min).max(max));
