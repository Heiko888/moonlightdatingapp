# Supabase E-Mail-Konfiguration

## SMTP-Einstellungen

### Gmail-Konfiguration:
```
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP User: ihre-email@gmail.com
SMTP Password: [App-Passwort von Google]
SMTP Admin Email: ihre-email@gmail.com
SMTP Sender Name: Human Design App
```

### Outlook-Konfiguration:
```
SMTP Host: smtp-mail.outlook.com
SMTP Port: 587
SMTP User: ihre-email@outlook.com
SMTP Password: [Ihr Outlook-Passwort]
SMTP Admin Email: ihre-email@outlook.com
SMTP Sender Name: Human Design App
```

## E-Mail-Template anpassen

### Bestätigungs-E-Mail:
```
Betreff: Bestätigen Sie Ihre E-Mail-Adresse für Human Design App

Hallo {{ .Email }},

willkommen bei der Human Design App! 

Bitte bestätigen Sie Ihre E-Mail-Adresse, indem Sie auf den folgenden Link klicken:

{{ .ConfirmationURL }}

Falls Sie sich nicht registriert haben, können Sie diese E-Mail ignorieren.

Mit freundlichen Grüßen,
Das Human Design App Team
```

### Passwort-Reset-E-Mail:
```
Betreff: Passwort zurücksetzen - Human Design App

Hallo {{ .Email }},

Sie haben ein Passwort-Reset für Ihr Human Design App Konto angefordert.

Klicken Sie auf den folgenden Link, um Ihr Passwort zurückzusetzen:

{{ .ConfirmationURL }}

Falls Sie diese Anfrage nicht gestellt haben, können Sie diese E-Mail ignorieren.

Mit freundlichen Grüßen,
Das Human Design App Team
```

## Wichtige Hinweise:

1. **Gmail App-Passwort erstellen:**
   - Google-Konto → Sicherheit → 2-Faktor-Authentifizierung
   - App-Passwörter → App auswählen → Passwort generieren

2. **E-Mail-Bestätigung aktivieren:**
   - Authentication → Providers → Email
   - "Confirm email" aktivieren

3. **E-Mail-Limits beachten:**
   - Supabase Free: 30 E-Mails/Tag
   - Supabase Pro: 1000 E-Mails/Tag
