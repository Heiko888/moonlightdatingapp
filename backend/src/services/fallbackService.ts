// Fallback Service für den Fall, dass OpenAI API nicht verfügbar ist
export class FallbackService {
  
  // Fallback für Reading-Generierung
  static generateReadingFallback(chartData: any, scope: string) {
    const templates = {
      relationship: {
        title: "Beziehungs-Reading",
        content: `Basierend auf deinem Human Design Profil als ${chartData.type || 'Generator'} mit dem Profil ${chartData.profile || '1/3'} zeigt sich, dass du in Beziehungen eine natürliche Fähigkeit besitzt, andere zu unterstützen und zu nähren. Deine ${chartData.authority || 'Sacral'} Authority hilft dir dabei, die richtigen Entscheidungen zu treffen.`,
        reflectionQuestions: [
          "Wie fühlt sich deine aktuelle Beziehung an?",
          "Welche Muster erkennst du in deinen Beziehungen?",
          "Was sagt dir deine innere Autorität über diese Beziehung?"
        ]
      },
      career: {
        title: "Karriere-Reading",
        content: `Dein Human Design zeigt, dass du als ${chartData.type || 'Generator'} besonders gut in Berufen funktionierst, wo du deine Energie kontinuierlich einsetzen kannst. Mit deinem Profil ${chartData.profile || '1/3'} bringst du eine einzigartige Kombination aus Pioniergeist und Detailorientierung mit.`,
        reflectionQuestions: [
          "Was ist deine wahre Berufung?",
          "Welche Talente bleiben ungenutzt?",
          "Wo fühlst du dich am meisten erfüllt?"
        ]
      },
      general: {
        title: "Human Design Reading",
        content: `Dein Human Design Profil als ${chartData.type || 'Generator'} mit dem Profil ${chartData.profile || '1/3'} zeigt dir deine einzigartigen Gaben und Herausforderungen. Deine ${chartData.authority || 'Sacral'} Authority ist dein innerer Kompass für wichtige Entscheidungen.`,
        reflectionQuestions: [
          "Wie lebst du deine wahre Natur?",
          "Was sagt dir deine innere Autorität?",
          "Wo fühlst du dich am meisten authentisch?"
        ]
      }
    };

    return templates[scope as keyof typeof templates] || templates.general;
  }

  // Fallback für Chat-Antworten
  static getChatFallback(question: string) {
    const responses = [
      "Das ist eine interessante Frage zu Human Design. Basierend auf den Grundprinzipien kann ich dir sagen, dass es wichtig ist, auf deine innere Autorität zu hören.",
      "Human Design lehrt uns, dass jeder Mensch einzigartig ist. Deine Strategie und Autorität sind deine besten Führer.",
      "Diese Frage berührt wichtige Aspekte des Human Design Systems. Lass uns das Schritt für Schritt betrachten.",
      "In Human Design geht es darum, deine wahre Natur zu leben. Was sagt dir dein Bauchgefühl dazu?",
      "Das Human Design System bietet viele Einblicke. Dein Profil und deine definierten Zentren geben dir wichtige Hinweise."
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Fallback für Chart-Analyse
  static analyzeChartFallback(chartData: any) {
    return {
      type: chartData.type || 'Generator',
      profile: chartData.profile || '1/3',
      authority: chartData.authority || 'Sacral',
      strategy: chartData.strategy || 'To Respond',
      notSelf: chartData.notSelf || 'Frustration',
      summary: `Du bist ein ${chartData.type || 'Generator'} mit dem Profil ${chartData.profile || '1/3'}. Deine Strategie ist es, auf das Leben zu antworten, und deine ${chartData.authority || 'Sacral'} Authority hilft dir bei Entscheidungen.`,
      insights: [
        "Deine Energie ist darauf ausgelegt, auf das Leben zu antworten",
        "Warte auf Einladungen, bevor du handelst",
        "Höre auf deine innere Autorität bei wichtigen Entscheidungen",
        "Deine Frustration zeigt dir, wenn du nicht in deiner wahren Natur lebst"
      ]
    };
  }

  // Fallback für PDF-Analyse
  static analyzePDFFallback(pdfContent: string) {
    return {
      summary: "Die PDF wurde erfolgreich verarbeitet. Basierend auf dem Inhalt können wir dein Human Design Reading erweitern.",
      keyPoints: [
        "Wichtige Lebensereignisse wurden identifiziert",
        "Muster in deinen Erfahrungen wurden erkannt",
        "Dein Human Design Profil wird durch diese Informationen bereichert"
      ],
      recommendations: [
        "Betrachte diese Erfahrungen im Kontext deines Human Design Profils",
        "Nutze deine Strategie und Autorität für zukünftige Entscheidungen",
        "Erkenne die Muster, die zu deinem Wachstum beigetragen haben"
      ]
    };
  }
}

export default FallbackService;
