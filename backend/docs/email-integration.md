# E-Mail-Integration für Moonlight App

## Übersicht

Die Moonlight App sendet automatisch Willkommens-E-Mails nach der Erstregistrierung. Die Integration unterstützt sowohl **Mailchimp** als auch **HubSpot**.

## Konfiguration

### 1. Umgebungsvariablen

Füge folgende Variablen zu deiner `.env`-Datei hinzu:

```env
# E-Mail Provider (mailchimp oder hubspot)
EMAIL_PROVIDER=mailchimp

# API-Schlüssel für den gewählten Provider
EMAIL_API_KEY=your-api-key

# Mailchimp-spezifische Konfiguration
MAILCHIMP_LIST_ID=your-list-id

# HubSpot-spezifische Konfiguration
HUBSPOT_PORTAL_ID=your-portal-id

# E-Mail-Absender
FROM_EMAIL=noreply@moonlight-app.com

# Frontend URL für Links in E-Mails
FRONTEND_URL=http://localhost:3000
```

### 2. Mailchimp Setup

#### API-Schlüssel erhalten

1. Gehe zu [Mailchimp Account](https://login.mailchimp.com/)
2. Navigiere zu **Account → Extras → API Keys**
3. Erstelle einen neuen API-Schlüssel
4. Kopiere den Schlüssel in `EMAIL_API_KEY`

#### Liste-ID finden

1. Gehe zu **Audience → Settings → Audience name and defaults**
2. Kopiere die **Audience ID** (List ID) in `MAILCHIMP_LIST_ID`

#### Merge Fields erstellen

Erstelle folgende Merge Fields in deiner Mailchimp-Liste:

- `FNAME` (First Name)
- `USERNAME` (Username)
- `SIGNUP_DATE` (Signup Date)

### 3. HubSpot Setup

#### HubSpot API-Schlüssel erhalten

1. Gehe zu [HubSpot Developers](https://developers.hubspot.com/)
2. Erstelle eine neue App
3. Gehe zu **Auth → Private Apps**
4. Erstelle eine neue Private App mit folgenden Scopes:

   - `crm.objects.contacts.write`
   - `crm.objects.contacts.read`
   - `marketing.send`

5. Kopiere den API-Schlüssel in `EMAIL_API_KEY`

#### Portal-ID finden

1. Gehe zu **Settings → Account Setup → Account Defaults**
2. Kopiere die **Portal ID** in `HUBSPOT_PORTAL_ID`

#### Workflow erstellen

1. Gehe zu **Automation → Workflows**
2. Erstelle einen neuen Workflow für Willkommens-E-Mails
3. Verwende die Contact-Eigenschaften:
   - `email`
   - `firstname`
   - `username`
   - `signup_date`

## Funktionalität

### Automatische E-Mails

Nach jeder erfolgreichen Registrierung werden folgende E-Mails gesendet:

1. **Willkommens-E-Mail**

   - Persönliche Begrüßung
   - Registrierungsdaten
   - App-Features Übersicht
   - Call-to-Action zum Dashboard

2. **Newsletter-Anmeldung**

   - Automatische Anmeldung zur E-Mail-Liste
   - Tagging als "new-user"

### E-Mail-Template

Das E-Mail-Template enthält:

- Responsive Design
- Moonlight App Branding
- Persönliche Anrede
- Feature-Übersicht
- Call-to-Action Buttons
- Footer mit Links

## Fehlerbehandlung

### E-Mail-Fehler verhindern nicht die Registrierung

Falls das Senden der E-Mail fehlschlägt:

- Die Registrierung wird trotzdem abgeschlossen
- Fehler werden in den Server-Logs protokolliert
- Benutzer erhält trotzdem Zugang zur App

### Logging

E-Mail-Aktivitäten werden geloggt:

```text
✅ Willkommens-E-Mail erfolgreich gesendet an: user@example.com
⚠️ Fehler beim Senden der Willkommens-E-Mail: [Error Details]
```

## Testing

### Lokales Testing

1. Erstelle eine `.env`-Datei mit Test-Konfiguration
2. Registriere einen neuen Benutzer
3. Überprüfe die Server-Logs auf E-Mail-Aktivität
4. Prüfe dein E-Mail-Konto auf die Willkommens-E-Mail

### Test-E-Mail-Konfiguration

Für Tests kannst du temporär einen Test-API-Schlüssel verwenden:

```env
EMAIL_PROVIDER=mailchimp
EMAIL_API_KEY=test-api-key
MAILCHIMP_LIST_ID=test-list-id
```

## Sicherheit

### Datenschutz

- E-Mail-Adressen werden nur für legitime Zwecke verwendet
- Benutzer können sich jederzeit aus der E-Mail-Liste abmelden
- Alle E-Mails enthalten Abmelde-Links

### API-Sicherheit

- API-Schlüssel werden sicher in Umgebungsvariablen gespeichert
- HTTPS wird für alle API-Kommunikation verwendet
- Rate Limiting wird von Mailchimp/HubSpot gehandhabt

## Troubleshooting

### Häufige Probleme

1. **"Invalid API Key"**
   - Überprüfe den API-Schlüssel
   - Stelle sicher, dass der Schlüssel aktiv ist

2. **"List not found"**
   - Überprüfe die Mailchimp List ID
   - Stelle sicher, dass die Liste existiert

3. **"Portal not found"**
   - Überprüfe die HubSpot Portal ID
   - Stelle sicher, dass du Zugriff auf das Portal hast

### Debug-Modus

Aktiviere Debug-Logging:

```env
NODE_ENV=development
DEBUG=email:*
```

## Support

Bei Problemen mit der E-Mail-Integration:

1. Überprüfe die Server-Logs
2. Teste die API-Konfiguration
3. Kontaktiere den Support mit den Log-Details
