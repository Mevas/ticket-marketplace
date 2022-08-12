import { z } from "zod";

export const authFormSchema = z.object({
  email: z.string().email(),
  name: z.string().min(3, "Name has to be at least 3 characters long"),
});

export type AuthFormParams = z.infer<typeof authFormSchema>;
