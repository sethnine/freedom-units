import { z } from "zod";
export const packageSchema = z.object({
  licenses: z.string(),
  name: z.string().optional(),
  repository: z.string().optional(),
  publisher: z.string().optional(),
  email: z.string().optional(),
  url: z.string().optional(),
  private: z.boolean().optional(),
});
