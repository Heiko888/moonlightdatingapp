import { Request, Response, NextFunction } from "express";
import { z } from "zod4";

export const LoginSchema = z.object({
  email: z.string().email("Bitte gib eine gültige E-Mail an."),
  password: z.string().min(8, "Passwort muss mind. 8 Zeichen haben."),
});

type LoginBody = z.infer<typeof LoginSchema>;

export function validateLogin(
  req: Request<{}, {}, LoginBody>,
  res: Response,
  next: NextFunction
) {
  const parsed = LoginSchema.safeParse(req.body);

  if (!parsed.success) {
    // kompakte, feldweise Fehlermeldungen
    const { fieldErrors, formErrors } = parsed.error.flatten();
    return res.status(400).json({
      error: "Ungültige Eingabe",
      fieldErrors,
      formErrors,
    });
  }

  // validierte Daten zurück in die Request-Body (typisch)
  req.body = parsed.data;
  return next();
}
