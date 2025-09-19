"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginSchema = void 0;
exports.validateLogin = validateLogin;
const zod4_1 = require("zod4");
exports.LoginSchema = zod4_1.z.object({
    email: zod4_1.z.string().email("Bitte gib eine gültige E-Mail an."),
    password: zod4_1.z.string().min(8, "Passwort muss mind. 8 Zeichen haben."),
});
function validateLogin(req, res, next) {
    const parsed = exports.LoginSchema.safeParse(req.body);
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
