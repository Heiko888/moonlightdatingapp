export const getWelcomeEmailTemplate = (userData: {
  name: string;
  username: string;
  email: string;
}) => {
  const { name, username, email } = userData;
  
  return `
    <!DOCTYPE html>
    <html lang="de">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Willkommen bei Moonlight App</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 30px;
          text-align: center;
          color: white;
        }
        .header h1 {
          margin: 0;
          font-size: 2.5rem;
          font-weight: 800;
          text-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
        .header .subtitle {
          margin-top: 10px;
          font-size: 1.1rem;
          opacity: 0.9;
        }
        .content {
          padding: 40px 30px;
        }
        .welcome-text {
          font-size: 1.2rem;
          margin-bottom: 30px;
          color: #4a5568;
        }
        .features {
          background: #f7fafc;
          border-radius: 8px;
          padding: 25px;
          margin: 30px 0;
        }
        .features h3 {
          color: #667eea;
          margin-top: 0;
          font-size: 1.3rem;
        }
        .feature-list {
          list-style: none;
          padding: 0;
        }
        .feature-list li {
          padding: 8px 0;
          padding-left: 25px;
          position: relative;
        }
        .feature-list li:before {
          content: "✨";
          position: absolute;
          left: 0;
          color: #fbbf24;
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 15px 30px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1.1rem;
          margin: 20px 0;
          transition: transform 0.2s;
        }
        .cta-button:hover {
          transform: translateY(-2px);
        }
        .footer {
          background: #f7fafc;
          padding: 30px;
          text-align: center;
          color: #718096;
          font-size: 0.9rem;
        }
        .social-links {
          margin: 20px 0;
        }
        .social-links a {
          color: #667eea;
          text-decoration: none;
          margin: 0 10px;
        }
        .user-info {
          background: #e6fffa;
          border-left: 4px solid #38b2ac;
          padding: 15px;
          margin: 20px 0;
          border-radius: 0 8px 8px 0;
        }
        .user-info strong {
          color: #2d3748;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌟 Moonlight App</h1>
          <div class="subtitle">Willkommen in der Welt des Human Design</div>
        </div>
        
        <div class="content">
          <div class="welcome-text">
            <p>Hallo <strong>${name}</strong>! 👋</p>
            <p>Herzlich willkommen bei Moonlight App! Wir freuen uns, dass du dich für Human Design und die Entdeckung deines einzigartigen Wesens interessierst.</p>
          </div>

          <div class="user-info">
            <p><strong>Deine Registrierungsdaten:</strong></p>
            <p>Benutzername: <strong>${username}</strong></p>
            <p>E-Mail: <strong>${email}</strong></p>
            <p>Registrierungsdatum: <strong>${new Date().toLocaleDateString('de-DE')}</strong></p>
          </div>

          <div class="features">
            <h3>🎯 Was dich bei Moonlight App erwartet:</h3>
            <ul class="feature-list">
              <li><strong>Human Design Chart:</strong> Erstelle dein persönliches Human Design Chart basierend auf deinen Geburtsdaten</li>
              <li><strong>Persönliche Deutungen:</strong> Erhalte detaillierte Interpretationen deiner Chart-Elemente</li>
              <li><strong>Community:</strong> Vernetze dich mit Gleichgesinnten und teile deine Erfahrungen</li>
              <li><strong>Coaching:</strong> Buche persönliche Sessions mit zertifizierten Human Design Coaches</li>
              <li><strong>Mondkalender:</strong> Nutze die Mondphasen für optimale Entscheidungen</li>
              <li><strong>Dating & Matching:</strong> Finde Partner basierend auf Human Design Kompatibilität</li>
            </ul>
          </div>

          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" class="cta-button">
              🚀 Zum Dashboard
            </a>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #718096; font-size: 0.9rem;">
              <strong>Nächste Schritte:</strong><br>
              1. Erstelle dein Human Design Chart<br>
              2. Lade dein Profilbild hoch<br>
              3. Entdecke die Community
            </p>
          </div>
        </div>

        <div class="footer">
          <p><strong>Moonlight App</strong> - Entdecke dein wahres Selbst</p>
          <div class="social-links">
            <a href="#">Website</a> |
            <a href="#">Support</a> |
            <a href="#">Datenschutz</a>
          </div>
          <p style="margin-top: 20px; font-size: 0.8rem;">
            Diese E-Mail wurde an ${email} gesendet.<br>
            Falls du dich nicht registriert hast, kannst du diese E-Mail ignorieren.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const getWelcomeEmailSubject = (name: string) => {
  return `🌟 Willkommen bei Moonlight App, ${name}!`;
};
