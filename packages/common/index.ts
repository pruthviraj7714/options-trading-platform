import z from "zod";

export const SignupSchema = z.object({
  username: z.string(),
  password: z
    .string()
    .min(8, { message: "Password Should be at least of 6 characters" }),
});

export const SigninSchema = z.object({
  username: z.string(),
  password: z
    .string()
    .min(8, { message: "Password Should be at least of 6 characters" }),
});

export const OrderSchema = z.object({
  volume : z.number().min(0, {message : "Volume Must be greater than 0"}),
  asset : z.string(),
  side : z.enum(["BUY", "SELL"]),
})
