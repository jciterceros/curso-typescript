import { z } from "zod";

export const numberFromInputSchema = (min: number, max: number) =>
  z.preprocess((value) => {
    if (value === undefined) {
      return undefined;
    }

    if (typeof value === "number") {
      return value;
    }

    if (typeof value === "string") {
      if (value.trim() === "") {
        return Number.NaN;
      }
      return Number(value);
    }

    return Number.NaN;
  }, z.number().int().min(min).max(max));
