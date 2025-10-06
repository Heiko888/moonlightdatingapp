'use client';

import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  Chip, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  List,
  Button,
  Grid
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Target, 
  Crown,
  ArrowLeft,
  ChevronDown
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { usePlanetData } from '../../../hooks/usePlanetData';

// Hilfsfunktion für Business-Beschreibungen
const getBusinessDescription = (gateNumber: number): string => {
  const descriptions: { [key: number]: string } = {
    1: 'Kommunikation als Verkaufshebel und Marktposition. Deine Sprache ist nicht nur Marketing – sie ist der direkte Auslöser für Kaufentscheidungen.',
    2: 'Sprache als strategischer Kompass. Du bist der Navigator in einem Meer aus Möglichkeiten – und deine Sprache ist das Steuerrad. Je klarer deine Worte, desto klarer dein Platz im Markt.',
    3: 'Sprache als Strukturgeber im Business. Du kannst Chaos in eine klare Abfolge bringen – ob in Projekten, Angeboten, Verkaufsprozessen oder Marketingstrategien. Deine Sprache ist das Werkzeug, das aus einem diffusen Ideenpool einen konkreten Plan macht.',
    4: 'Sprache als Vertrauensanker. Du kannst komplexe Herausforderungen so formulieren, dass sie lösbar erscheinen. Kunden spüren, dass du nicht nur schöne Worte machst, sondern Argumente lieferst, die Hand und Fuß haben.',
    5: 'Sprache als Taktgeber für dein Business. Du setzt Rhythmen in deiner Kommunikation, die Kunden und Team Orientierung geben. Wiederholung ist im Business nicht langweilig – sie ist Markenaufbau.',
    6: 'Sprache als Qualitätsfilter. Deine Kommunikation zieht nicht alle, sondern die Richtigen an. Du sprichst mit klarer Haltung und benennst, für wen dein Angebot gedacht ist – und für wen nicht. Das spart dir Energie, weil nur Menschen bleiben, die mit deiner Frequenz übereinstimmen.',
    7: 'Sprache als Leadership-Tool. Du setzt nicht nur Inhalte, du setzt Richtung – für dein Team, deine Kunden und deinen Markt. Deine Worte können Projekte fokussieren, Visionen schärfen und Gemeinschaften ausrichten. Kunden und Partner folgen Menschen, die wissen, wohin sie gehen.',
    8: 'Sprache als Differenzierungsfaktor. Deine Kommunikation ist nicht austauschbar – sie trägt deine persönliche Signatur. Du setzt ungewöhnliche Perspektiven, prägst eigene Begriffe oder Sprachbilder und verknüpfst Themen auf individuelle Weise. So wird deine Kommunikation selbst zum Erkennungsmerkmal deiner Marke.',
    9: 'Sprache als Fokussierungswerkzeug. Du kannst Marketing, Verkaufsgespräche und Präsentationen so gestalten, dass der Kern unübersehbar wird. Du schneidest Rauschen weg und lässt nur das Wesentliche übrig – das, was wirklich überzeugt. Statt zehn Dinge gleichzeitig zu versprechen, fokussierst du auf die eine Sache, die deine Zielgruppe am meisten braucht.',
    10: 'Sprache als Markenidentität. Deine Zielgruppe erkennt dich nicht nur an deinem Logo oder Angebot, sondern an der Haltung, die in jeder Formulierung mitschwingt. Du kommunizierst nicht nur, was du tust, sondern warum du es tust. Du formulierst deine Prinzipien so, dass Kunden wissen, was sie erwarten können.',
    11: 'Sprache als Visionskraft im Business. Du verkaufst nicht nur Produkte oder Dienstleistungen – du verkaufst Vorstellungen davon, wie die Welt mit deinem Angebot aussehen könnte. Du setzt Metaphern, um komplexe Dinge einfach zu machen, erzählst, wohin sich Kunden entwickeln können, und nutzt Bilder, um Emotionen zu verankern.',
    12: 'Sprache als strategisches Werkzeug. Du setzt Botschaften nicht inflationär, sondern gezielt – und genau das macht sie wertvoll. Du weißt, dass Menschen nicht alles aufnehmen, was sie hören – aber sie erinnern sich an den einen Satz, der zur richtigen Zeit kam. Du setzt Key-Messages im richtigen Moment und platzierst dein stärkstes Argument, wenn der Kunde emotional bereit ist.',
    13: 'Sprache als Resonanzraum. Du hast die Fähigkeit, Feedback, Bedürfnisse und Stimmungen aufzunehmen und daraus Worte zu formen, die Resonanz erzeugen. Du wirst zur Stimme, die das ausspricht, was viele fühlen, aber nur wenige benennen können. Du greifst Formulierungen auf, die Kunden selbst verwenden und erzählst Geschichten aus deiner Community, die zeigen, dass du ihre Realität verstehst.',
    14: 'Sprache als Wertgenerator. Du bist ein Meister darin, den Wert deines Angebots – und den anderer – klar zu formulieren. Kunden kaufen nicht nur, weil etwas existiert, sondern weil sie den Wert darin erkennen. Du formulierst, wie dein Angebot Ressourcen spart oder vermehrt, zeigst, wie deine Arbeit langfristigen Gewinn bringt, und setzt Sprache ein, um Investitionssicherheit zu vermitteln.',
    15: 'Sprache als Brücke im Business. Du bist ein Vermittler, der durch klare und zugleich verbindende Sprache Spannungen entschärfen und Kooperation ermöglichen kann. Du kommunizierst verbindend, ohne beliebig zu sein, kannst Widersprüche in der Branche so ansprechen, dass sie als Chancen wirken, und vermittelst ein Bild von Offenheit und Flexibilität.',
    16: 'Sprache als Energiequelle im Business. Du bist ein Energiegeber. Deine Kommunikation kann Projekte anschieben, Teams motivieren und Kunden begeistern. Du bist in der Lage, Produkte oder Ideen so zu präsentieren, dass andere Lust bekommen, dabei zu sein – nicht nur wegen des Inhalts, sondern wegen der Energie, die du transportierst.',
    17: 'Sprache als Positionierungswerkzeug. Du bist eine klare Stimme in deinem Markt. Du bist in der Lage, Trends zu analysieren, Positionen zu beziehen und diese in verständliche Botschaften zu übersetzen. Du schaffst Vertrauen, weil du klar Stellung beziehst, ziehst Menschen an, die deine Sicht teilen, und bist erkennbar, weil du dich nicht im Ungefähren hältst.',
    18: 'Sprache als Optimierungskraft. Du bist ein wertvoller Partner, der nicht nur Probleme benennt, sondern zur Lösung beiträgt. Du kannst Prozesse, Produkte und Strategien durch präzise Formulierungen verbessern – ohne in pauschale Kritik zu verfallen. Du positionierst dich durch lösungsorientiertes Feedback und sprichst Verbesserungspotenzial klar und respektvoll aus.',
    19: 'Sprache als Bindungskraft. Du bist ein sensibler Kommunikator. Du spürst, was deine Kunden wirklich bewegt – und kannst es in Worte fassen. Im Marketing sprichst du Bedürfnisse an, bevor sie bewusst werden. Im Verkauf schaffst du durch einfühlsame Sprache Vertrauen. In der Zusammenarbeit stärkst du Loyalität durch klare, respektvolle Kommunikation.',
    20: 'Sprache als Energie-Booster. Du bist ein Kommunikator mit Lebendigkeit. Deine Worte sind nicht auswendig gelernt – sie entstehen live. Das gibt dir Authentizität in Präsentationen, Kundengesprächen und auf der Bühne. Im Verkauf überzeugst du durch spontane Antworten, im Marketing schaffst du lebendige, authentische Botschaften, und in der Führung bist du die Stimme, die Klarheit im Jetzt schafft.',
    21: 'Sprache als Führungsinstrument. Du bist eine starke Stimme für Organisation und Kontrolle. Du kannst klar benennen, was funktioniert und was nicht. Im Marketing setzt du klare Botschaften, im Verkauf formulierst du eindeutige Angebote, und in der Führung definierst du Strukturen und Verantwortlichkeiten. Du führst durch klare, respektvolle Kommunikation und setzt Grenzen, die Sicherheit schaffen.',
    22: 'Sprache als Harmonisierungsfaktor. Du bist ein Kommunikator, der Balance schafft. Du kannst verschiedene Perspektiven zusammenführen und eine Sprache finden, die alle Seiten anspricht. Im Marketing schaffst du Botschaften, die verschiedene Zielgruppen erreichen, im Verkauf vermittelst du zwischen Kundenwünschen und Angebot, und in der Führung schaffst du eine Atmosphäre, in der alle gehört werden.',
    23: 'Sprache als Differenzierungsfaktor. Du bist ein Kommunikator, der sich abhebt. Du findest ungewöhnliche Winkel, prägst eigene Begriffe und schaffst eine Sprache, die unverwechselbar ist. Im Marketing entwickelst du eine eigene Tonalität, im Verkauf überzeugst du durch unerwartete Perspektiven, und in der Führung schaffst du eine Kultur, die sich von anderen unterscheidet.',
    24: 'Sprache als Erneuerungskraft. Du bist ein Kommunikator, der Dinge in Bewegung bringt. Du kannst alte Muster durchbrechen und neue Wege aufzeigen. Im Marketing schaffst du Aufmerksamkeit durch unkonventionelle Ansätze, im Verkauf überzeugst du durch innovative Lösungen, und in der Führung inspirierst du zu Veränderungen.',
    25: 'Sprache als Authentizitätsfaktor. Du bist ein Kommunikator, der echt ist. Du sprichst aus dem Herzen und schaffst dadurch tiefe Verbindungen. Im Marketing überzeugst du durch echte Geschichten, im Verkauf schaffst du Vertrauen durch Ehrlichkeit, und in der Führung inspirierst du durch authentische Vorbildfunktion.',
    26: 'Sprache als Verkaufshebel. Du bist ein Kommunikator, der überzeugt. Du kannst die Vorteile deines Angebots so darstellen, dass Kunden den Wert erkennen. Im Marketing schaffst du klare Nutzenversprechen, im Verkauf überzeugst du durch logische Argumentation, und in der Führung motivierst du durch klare Ziele.',
    27: 'Sprache als Fürsorgefaktor. Du bist ein Kommunikator, der sich um andere kümmert. Du sprichst mit Empathie und schaffst dadurch Vertrauen. Im Marketing sprichst du die Bedürfnisse deiner Zielgruppe an, im Verkauf schaffst du eine angenehme Atmosphäre, und in der Führung sorgst du für das Wohlbefinden deines Teams.',
    28: 'Sprache als Spielkraft. Du bist ein Kommunikator, der Freude bringt. Du kannst auch ernste Themen mit Leichtigkeit vermitteln. Im Marketing schaffst du positive Emotionen, im Verkauf machst du den Prozess angenehm, und in der Führung schaffst du eine motivierende Atmosphäre.',
    29: 'Sprache als Engagementfaktor. Du bist ein Kommunikator, der begeistert. Du kannst andere für deine Ideen gewinnen. Im Marketing schaffst du Begeisterung für dein Angebot, im Verkauf überzeugst du durch Enthusiasmus, und in der Führung inspirierst du zu Höchstleistungen.',
    30: 'Sprache als Gefühlsfaktor. Du bist ein Kommunikator, der Emotionen weckt. Du kannst tiefe Gefühle ansprechen und dadurch Verbindungen schaffen. Im Marketing schaffst du emotionale Bindung, im Verkauf überzeugst du durch Gefühl, und in der Führung schaffst du eine emotionale Verbindung zum Team.',
    31: 'Sprache als Einflussfaktor. Du bist ein Kommunikator, der überzeugt. Du kannst andere durch deine Worte beeinflussen. Im Marketing schaffst du Überzeugungskraft, im Verkauf überzeugst du durch Argumente, und in der Führung gewinnst du andere für deine Vision.',
    32: 'Sprache als Kontinuitätsfaktor. Du bist ein Kommunikator, der Beständigkeit schafft. Du kannst langfristige Beziehungen aufbauen. Im Marketing schaffst du Kundenbindung, im Verkauf baust du langfristige Partnerschaften auf, und in der Führung schaffst du eine stabile Teamkultur.',
    33: 'Sprache als Rückzugsfaktor. Du bist ein Kommunikator, der weiß, wann zu schweigen ist. Du kannst auch durch Stille wirken. Im Marketing schaffst du Spannung durch gezielte Pausen, im Verkauf lässt du Kunden nachdenken, und in der Führung schaffst du Raum für Reflexion.',
    34: 'Sprache als Kraftfaktor. Du bist ein Kommunikator, der Stärke ausstrahlt. Du kannst durch deine Worte Macht und Autorität vermitteln. Im Marketing schaffst du eine starke Markenidentität, im Verkauf überzeugst du durch Kompetenz, und in der Führung schaffst du Respekt und Autorität.',
    35: 'Sprache als Veränderungsfaktor. Du bist ein Kommunikator, der Neues schafft. Du kannst durch deine Worte Innovation und Wandel anstoßen. Im Marketing schaffst du Aufmerksamkeit durch neue Ansätze, im Verkauf überzeugst du durch innovative Lösungen, und in der Führung inspirierst du zu Veränderungen.',
    36: 'Sprache als Krisenfaktor. Du bist ein Kommunikator, der in schwierigen Zeiten Orientierung gibt. Du kannst durch deine Worte Sicherheit und Stabilität vermitteln. Im Marketing schaffst du Vertrauen in unsicheren Zeiten, im Verkauf überzeugst du durch Zuverlässigkeit, und in der Führung schaffst du Sicherheit für dein Team.',
    37: 'Sprache als Teambildungsfaktor. Du bist ein Kommunikator, der Menschen zusammenbringt. Du kannst durch deine Worte Gemeinschaft und Zusammenhalt schaffen. Im Marketing schaffst du eine Community, im Verkauf baust du langfristige Beziehungen auf, und in der Führung schaffst du ein starkes Team.',
    38: 'Sprache als Kampffaktor. Du bist ein Kommunikator, der für seine Überzeugungen einsteht. Du kannst durch deine Worte für das kämpfen, was dir wichtig ist. Im Marketing schaffst du eine klare Positionierung, im Verkauf überzeugst du durch Leidenschaft, und in der Führung schaffst du eine starke Unternehmenskultur.',
    39: 'Sprache als Provokationsfaktor. Du bist ein Kommunikator, der zum Nachdenken anregt. Du kannst durch deine Worte bestehende Muster in Frage stellen. Im Marketing schaffst du Aufmerksamkeit durch provokante Botschaften, im Verkauf überzeugst du durch unkonventionelle Ansätze, und in der Führung inspirierst du zu neuen Denkweisen.',
    40: 'Sprache als Verpflichtungsfaktor. Du bist ein Kommunikator, der Zusagen macht und hält. Du kannst durch deine Worte Vertrauen und Verlässlichkeit schaffen. Im Marketing schaffst du klare Versprechen, im Verkauf baust du Vertrauen durch Zusagen auf, und in der Führung schaffst du eine Kultur der Verlässlichkeit.',
    41: 'Sprache als Startfaktor. Du bist ein Kommunikator, der Dinge ins Rollen bringt. Du kannst durch deine Worte neue Projekte und Initiativen starten. Im Marketing schaffst du Aufmerksamkeit für neue Angebote, im Verkauf startest du neue Verkaufszyklen, und in der Führung initiierst du neue Projekte.',
    42: 'Sprache als Reifefaktor. Du bist ein Kommunikator, der Dinge zur Vollendung bringt. Du kannst durch deine Worte Projekte und Prozesse abschließen. Im Marketing schaffst du Abschlüsse und Conversions, im Verkauf schließt du Verkäufe ab, und in der Führung bringst du Projekte zum Erfolg.',
    43: 'Sprache als Offenbarungsfaktor. Du bist ein Kommunikator, der Einsichten bringt. Du kannst durch deine Worte neue Erkenntnisse und Durchbrüche schaffen. Im Marketing positionierst du dich durch frische Einsichten, im Verkauf bringst du Innovation, und im Team inspirierst du zu Durchbrüchen. Du positionierst dich durch Innovation und schaffst eine Marke, die für Einsicht und Durchbruch steht.'
  };
  
  return descriptions[gateNumber] || 'Sprache als Business-Tool. Deine Kommunikation ist ein wichtiger Faktor für deinen geschäftlichen Erfolg.';
};

export default function MercuryPage() {
  const router = useRouter();

  // Lade Mercury-Daten aus der Datenbank
  const { planetInfo, planetGates, planetCenters, loading, error } = usePlanetData('Mercury');

  // Loading und Error States
  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: `
          radial-gradient(circle at 20% 20%, rgba(255, 107, 157, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(78, 205, 196, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 60%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
          linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)
        `,
        color: 'white'
      }}>
        <Typography variant="h4">Lade Mercury-Daten...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: `
          radial-gradient(circle at 20% 20%, rgba(255, 107, 157, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(78, 205, 196, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 60%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
          linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)
        `,
        color: 'white'
      }}>
        <Typography variant="h4">Fehler beim Laden der Daten: {error}</Typography>
      </Box>
    );
  }

  // Fallback-Daten falls Datenbank nicht verfügbar
  const fallbackMercuryInfo = {
    planet_name: "Merkur",
    symbol: "☿",
    orbital_period: "88 Tage",
    discovery: "Seit der Antike",
    mythology: "Der Bote der Götter",
    color: "#87CEEB",
    description: "Merkur repräsentiert Kommunikation, Denken und Austausch. Er zeigt, wie wir kommunizieren, Informationen verarbeiten und uns ausdrücken."
  };




  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0B0D12 0%, #1A1F2B 50%, #2D3748 100%)',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Stars */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          radial-gradient(2px 2px at 20px 30px, #87CEEB, transparent),
          radial-gradient(2px 2px at 40px 70px, #87CEEB, transparent),
          radial-gradient(1px 1px at 90px 40px, #87CEEB, transparent),
          radial-gradient(1px 1px at 130px 80px, #87CEEB, transparent),
          radial-gradient(2px 2px at 160px 30px, #87CEEB, transparent)
        `,
        backgroundRepeat: 'repeat',
        backgroundSize: '200px 100px',
        animation: 'twinkle 4s ease-in-out infinite alternate'
      }} />

      {/* Animated Mercury */}
      <motion.div
        
        animate={{ 
          opacity: 0.4, 
          scale: [1, 1.05, 1],
          rotate: 360
        }}
        transition={{ 
          scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 15, repeat: Infinity, ease: "linear" }
        }}
        style={{
          position: 'absolute',
          top: '5%',
          right: '8%',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: `
            radial-gradient(circle at 30% 30%, #C0C0C0, #A0A0A0, #808080),
            radial-gradient(circle at 70% 70%, #A0A0A0, #808080, #606060),
            radial-gradient(circle at 50% 50%, #87CEEB, #5F9EA0)
          `,
          boxShadow: `
            0 0 30px rgba(135, 206, 235, 0.4),
            0 0 60px rgba(95, 158, 160, 0.3),
            inset -10px -10px 20px rgba(0, 0, 0, 0.3)
          `,
          zIndex: 0
        }}
      >
        {/* Mercury Surface Details - Craters */}
        <Box sx={{
          position: 'absolute',
          top: '20%',
          left: '25%',
          width: '15px',
          height: '15px',
          borderRadius: '50%',
          background: 'rgba(96, 96, 96, 0.8)',
          boxShadow: 'inset 2px 2px 4px rgba(0, 0, 0, 0.5)'
        }} />
        <Box sx={{
          position: 'absolute',
          top: '60%',
          left: '60%',
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: 'rgba(128, 128, 128, 0.7)',
          boxShadow: 'inset 1px 1px 3px rgba(0, 0, 0, 0.5)'
        }} />
        <Box sx={{
          position: 'absolute',
          top: '40%',
          left: '10%',
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          background: 'rgba(96, 96, 96, 0.6)',
          boxShadow: 'inset 2px 2px 4px rgba(0, 0, 0, 0.5)'
        }} />
        <Box sx={{
          position: 'absolute',
          top: '70%',
          left: '20%',
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: 'rgba(128, 128, 128, 0.8)',
          boxShadow: 'inset 1px 1px 3px rgba(0, 0, 0, 0.5)'
        }} />
        <Box sx={{
          position: 'absolute',
          top: '30%',
          left: '70%',
          width: '14px',
          height: '14px',
          borderRadius: '50%',
          background: 'rgba(96, 96, 96, 0.7)',
          boxShadow: 'inset 2px 2px 4px rgba(0, 0, 0, 0.5)'
        }} />
      </motion.div>

      {/* Mercury's Orbit Trail */}
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          top: '0%',
          right: '3%',
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          border: '1px solid rgba(135, 206, 235, 0.2)',
          zIndex: -1
        }}
      />

      {/* Communication Signals */}
      <motion.div
        animate={{ 
          scale: [0, 1, 0],
          opacity: [0, 0.6, 0]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeOut"
        }}
        style={{
          position: 'absolute',
          top: '15%',
          right: '20%',
          width: '2px',
          height: '2px',
          borderRadius: '50%',
          background: '#87CEEB',
          boxShadow: '0 0 8px rgba(135, 206, 235, 0.6)',
          zIndex: 0
        }}
      />
      <motion.div
        animate={{ 
          scale: [0, 1, 0],
          opacity: [0, 0.5, 0]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeOut",
          delay: 1
        }}
        style={{
          position: 'absolute',
          top: '25%',
          right: '25%',
          width: '1px',
          height: '1px',
          borderRadius: '50%',
          background: '#5F9EA0',
          boxShadow: '0 0 6px rgba(95, 158, 160, 0.5)',
          zIndex: 0
        }}
      />
      <motion.div
        animate={{ 
          scale: [0, 1, 0],
          opacity: [0, 0.4, 0]
        }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          ease: "easeOut",
          delay: 2
        }}
        style={{
          position: 'absolute',
          top: '35%',
          right: '15%',
          width: '3px',
          height: '3px',
          borderRadius: '50%',
          background: '#87CEEB',
          boxShadow: '0 0 10px rgba(135, 206, 235, 0.4)',
          zIndex: 0
        }}
      />

      <Container maxWidth="lg" sx={{ padding: 4, position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
          <Button
            variant="outlined"
            onClick={() => router.push('/planets')}
            sx={{
              color: '#87CEEB',
              borderColor: '#87CEEB',
              '&:hover': {
                borderColor: '#87CEEB',
                backgroundColor: 'rgba(135, 206, 235, 0.1)',
                boxShadow: '0 0 20px rgba(135, 206, 235, 0.3)'
              },
              marginRight: 2
            }}
          >
            <ArrowLeft size={20} style={{ marginRight: 8 }} />
            Zurück zu den Planeten
          </Button>
        </Box>

        {/* Title */}
        <motion.div
          
          
          
        >
          <Box sx={{ textAlign: 'center', marginBottom: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 2 }}>
              <Brain size={48} color="#87CEEB" />
              <Typography variant="h2" sx={{ marginLeft: 2, fontWeight: 700, color: '#87CEEB' }}>
                {planetInfo?.planet_name || fallbackMercuryInfo.planet_name}
              </Typography>
            </Box>
            <Typography variant="h5" style={{ color: 'rgba(255,255,255,0.8)', fontStyle: 'italic' }}>
              {planetInfo?.mythology || fallbackMercuryInfo.mythology}
            </Typography>
            <Typography variant="body1" style={{ color: 'rgba(255,255,255,0.7)', marginTop: 2, maxWidth: '600px', margin: 'auto' }}>
              {planetInfo?.description || fallbackMercuryInfo.description}
            </Typography>
          </Box>
        </motion.div>

        {/* Planet Overview Card */}
        <motion.div
          
          
          
        >
          <Card sx={{
            background: 'linear-gradient(135deg, rgba(11,13,18,0.9) 0%, rgba(26,31,43,0.95) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: 3,
            border: '1px solid #87CEEB',
            boxShadow: '0 8px 32px rgba(135, 206, 235, 0.2)',
            p: 3,
            marginBottom: 4
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
              <Box sx={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #87CEEB, #4682B4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 2
              }}>
                <Typography variant="h4" style={{ color: '#000', fontWeight: 'bold' }}>
                  {planetInfo?.symbol || fallbackMercuryInfo.symbol}
                </Typography>
              </Box>
              <Box>
                <Typography variant="h5" style={{ color: 'white', fontWeight: 600 }}>
                  {planetInfo?.planet_name || fallbackMercuryInfo.planet_name} - Übersicht
                </Typography>
                <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Grundlegende Informationen über {planetInfo?.planet_name || fallbackMercuryInfo.planet_name}
                </Typography>
              </Box>
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" style={{ color: '#87CEEB', fontWeight: 600, marginBottom: 1 }}>
                    Umlaufzeit
                  </Typography>
                  <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.8)' }}>
                    {planetInfo?.orbital_period || fallbackMercuryInfo.orbital_period}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" style={{ color: '#87CEEB', fontWeight: 600, marginBottom: 1 }}>
                    Entdeckung
                  </Typography>
                  <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.8)' }}>
                    {planetInfo?.discovery || fallbackMercuryInfo.discovery}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" style={{ color: '#87CEEB', fontWeight: 600, marginBottom: 1 }}>
                    Mythologie
                  </Typography>
                  <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.8)' }}>
                    {planetInfo?.mythology || fallbackMercuryInfo.mythology}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" style={{ color: '#87CEEB', fontWeight: 600, marginBottom: 1 }}>
                    Element
                  </Typography>
                  <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.8)' }}>
                    Luft
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </motion.div>

        {/* Mercury in Gates */}
        <motion.div
          
          
          
        >
          <Card sx={{
            background: 'linear-gradient(135deg, rgba(11,13,18,0.9) 0%, rgba(26,31,43,0.95) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: 3,
            border: '1px solid #87CEEB',
            boxShadow: '0 8px 32px rgba(135, 206, 235, 0.2)',
            p: 3,
            marginBottom: 4
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Target size={24} color="#87CEEB" />
                <Typography variant="h5" sx={{ marginLeft: 2, fontWeight: 600, color: 'white' }}>
                  Merkur in den Gates
                </Typography>
              </Box>
              <Chip 
                label="Gates 1-8 von 64" 
                size="small" 
                sx={{ 
                  backgroundColor: 'rgba(135,206,235,0.2)',
                  color: '#87CEEB',
                  fontSize: '10px'
                }} 
              />
            </Box>
            <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 3, fontStyle: 'italic' }}>
              Hier sind alle 64 Gates mit Merkur-Informationen. Merkur zeigt unsere Kommunikationsweise und Denkprozesse in jedem Gate.
            </Typography>
            <List>
              {planetGates?.map((gate, index) => (
                <Accordion key={index} sx={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  marginBottom: 1,
                  '&:before': { display: 'none' },
                  '&.Mui-expanded': { margin: '0 0 8px 0' }
                }}>
                  <AccordionSummary
                    expandIcon={<ChevronDown color="#87CEEB" />}
                    sx={{ 
                      '& .MuiAccordionSummary-content': { 
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, #87CEEB, #5F9EA0)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 2
                      }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#000' }}>
                          {gate.gate_number}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="h6" style={{ color: 'white', fontWeight: 600 }}>
                          {gate.name || `Gate ${gate.gate_number}`}
                        </Typography>
                        <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.7)' }}>
                          {gate.description || 'Merkur Kommunikation'}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip 
                      label="Denken" 
                      size="small" 
                      sx={{ 
                        backgroundColor: 'rgba(135,206,235,0.2)',
                        color: '#87CEEB',
                        fontSize: '10px'
                      }} 
                    />
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ pl: 6 }}>
                      {/* Spezielle Anzeige für Tor 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42 & 43 */}
                      {(gate.gate_number === 1 && gate.name === 'Kreativität') || (gate.gate_number === 2 && gate.name === 'Empfang') || (gate.gate_number === 3 && gate.name === 'Anfang') || (gate.gate_number === 4 && gate.name === 'Antwort') || (gate.gate_number === 5 && gate.name === 'Warten') || (gate.gate_number === 6 && gate.name === 'Konflikt') || (gate.gate_number === 7 && gate.name === 'Armee') || (gate.gate_number === 8 && gate.name === 'Beteiligung') || (gate.gate_number === 9 && gate.name === 'Fokus') || (gate.gate_number === 10 && gate.name === 'Selbsttreue') || (gate.gate_number === 11 && gate.name === 'Idee') || (gate.gate_number === 12 && gate.name === 'Zurückhaltung') || (gate.gate_number === 13 && gate.name === 'Zuhören') || (gate.gate_number === 14 && gate.name === 'Besitz') || (gate.gate_number === 15 && gate.name === 'Bescheidenheit') || (gate.gate_number === 16 && gate.name === 'Begeisterung') || (gate.gate_number === 17 && gate.name === 'Meinung') || (gate.gate_number === 18 && gate.name === 'Korrektur') || (gate.gate_number === 19 && gate.name === 'Nähe') || (gate.gate_number === 20 && gate.name === 'Gegenwart') || (gate.gate_number === 21 && gate.name === 'Kontrolle') || (gate.gate_number === 22 && gate.name === 'Anmut') || (gate.gate_number === 23 && gate.name === 'Einfachheit') || (gate.gate_number === 24 && gate.name === 'Reflexion') || (gate.gate_number === 25 && gate.name === 'Unschuld') || (gate.gate_number === 26 && gate.name === 'Überzeugung') || (gate.gate_number === 27 && gate.name === 'Fürsorge') || (gate.gate_number === 28 && gate.name === 'Sinn') || (gate.gate_number === 29 && gate.name === 'Commitment') || (gate.gate_number === 30 && gate.name === 'Leidenschaft') || (gate.gate_number === 31 && gate.name === 'Führung') || (gate.gate_number === 32 && gate.name === 'Beständigkeit') || (gate.gate_number === 33 && gate.name === 'Rückblick') || (gate.gate_number === 34 && gate.name === 'Handlungskraft') || (gate.gate_number === 35 && gate.name === 'Erfahrung') || (gate.gate_number === 36 && gate.name === 'Herausforderung') || (gate.gate_number === 37 && gate.name === 'Gemeinschaft') || (gate.gate_number === 38 && gate.name === 'Standpunkt') || (gate.gate_number === 39 && gate.name === 'Provokation') || (gate.gate_number === 40 && gate.name === 'Verbindlichkeit') || (gate.gate_number === 41 && gate.name === 'Beginn') || (gate.gate_number === 42 && gate.name === 'Vollendung') || (gate.gate_number === 43 && gate.name === 'Einsicht') ? (
                        <>
                          {/* Persönlich/Business Struktur für Tor 1 & 2 */}
                          <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                              <Box sx={{ 
                                p: 3, 
                                background: 'rgba(135,206,235,0.1)', 
                                borderRadius: 2, 
                                border: '1px solid rgba(135,206,235,0.3)',
                                height: '100%'
                              }}>
                                <Typography variant="h6" style={{ color: '#87CEEB', fontWeight: 600, marginBottom: 2 }}>
                                  🌟 Persönlich
                                </Typography>
                                <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.9)', marginBottom: 2, fontStyle: 'italic' }}>
                                  {gate.personal_affirmation || (gate.gate_number === 1 ? '"Ich erschaffe durch meine Worte."' : 
                                   gate.gate_number === 2 ? '"Ich spreche aus Klarheit."' : 
                                   gate.gate_number === 3 ? '"Ich bringe Ordnung ins Chaos."' :
                                   gate.gate_number === 4 ? '"Ich bringe Logik in meine Worte."' :
                                   gate.gate_number === 5 ? '"Ich spreche im Rhythmus."' :
                                   gate.gate_number === 6 ? '"Ich spreche als Torhüter."' :
                                   gate.gate_number === 7 ? '"Ich leite durch meine Worte."' :
                                   gate.gate_number === 8 ? '"Ich gebe meiner Einzigartigkeit eine Stimme."' :
                                   gate.gate_number === 9 ? '"Meine Worte bündeln Energie."' :
                                   gate.gate_number === 10 ? '"Ich spreche aus meiner Selbsttreue."' :
                                   gate.gate_number === 11 ? '"Meine Worte tragen Bilder."' :
                                   gate.gate_number === 12 ? '"Ich spreche, wenn es zählt."' :
                                   gate.gate_number === 13 ? '"Ich höre die Geschichten anderer."' :
                                   gate.gate_number === 14 ? '"Ich spreche den Wert aus."' :
                                   gate.gate_number === 15 ? '"Ich spreche aus der Mitte."' :
                                   gate.gate_number === 16 ? '"Ich spreche mit Begeisterung."' :
                                   gate.gate_number === 17 ? '"Ich formuliere meine Sicht klar."' :
                                   gate.gate_number === 18 ? '"Ich spreche, um zu verbessern."' :
                                   gate.gate_number === 19 ? '"Ich spreche, um Verbindung zu schaffen."' :
                                   gate.gate_number === 20 ? '"Ich spreche im Jetzt."' :
                                   gate.gate_number === 21 ? '"Ich spreche, um zu führen."' :
                                   gate.gate_number === 22 ? '"Ich spreche mit Anmut."' :
                                   gate.gate_number === 23 ? '"Ich spreche, um Klarheit zu schaffen."' :
                                   gate.gate_number === 24 ? '"Ich spreche, um zurückzukehren."' :
                                   gate.gate_number === 25 ? '"Ich spreche aus Unschuld."' :
                                   gate.gate_number === 26 ? '"Ich spreche, um zu überzeugen."' :
                                   gate.gate_number === 27 ? '"Ich spreche, um Fürsorge auszudrücken."' :
                                   gate.gate_number === 28 ? '"Ich spreche über Sinn und Richtung."' :
                                   gate.gate_number === 29 ? '"Ich spreche mit Hingabe."' :
                                   gate.gate_number === 30 ? '"Ich spreche meine Sehnsucht aus."' :
                                   gate.gate_number === 31 ? '"Ich spreche als Stimme der Führung."' :
                                   gate.gate_number === 32 ? '"Ich spreche über das, was Bestand hat."' :
                                   gate.gate_number === 33 ? '"Ich spreche aus Erfahrung."' :
                                   gate.gate_number === 34 ? '"Ich spreche mit Kraft."' :
                                   gate.gate_number === 35 ? '"Ich spreche aus Erfahrung."' :
                                   gate.gate_number === 36 ? '"Ich spreche über das, was herausfordert."' :
                                   gate.gate_number === 37 ? '"Ich spreche, um Gemeinschaft zu stärken."' :
                                   gate.gate_number === 38 ? '"Ich spreche, um für das Wesentliche einzustehen."' :
                                   gate.gate_number === 39 ? '"Ich spreche, um Anstoß zu geben."' :
                                   gate.gate_number === 40 ? '"Ich spreche Verbindlichkeit aus."' :
                                   gate.gate_number === 41 ? '"Ich spreche den Anfang aus."' :
                                   gate.gate_number === 42 ? '"Ich spreche Geschichten zu Ende."' :
                                   '"Ich spreche meine Einsichten."')}
                                </Typography>
                                <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 2 }}>
                                  {gate.essence}
                                </Typography>
                                <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 2 }}>
                                  {gate.description}
                                </Typography>
                                <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.8)' }}>
                                  {gate.deep_meaning}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Box sx={{ 
                                p: 3, 
                                background: 'rgba(70,130,180,0.1)', 
                                borderRadius: 2, 
                                border: '1px solid rgba(70,130,180,0.3)',
                                height: '100%'
                              }}>
                                <Typography variant="h6" style={{ color: '#4682B4', fontWeight: 600, marginBottom: 2 }}>
                                  💼 Business
                                </Typography>
                                <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.9)', marginBottom: 2, fontStyle: 'italic' }}>
                                  {gate.business_affirmation || (gate.gate_number === 1 ? '"Meine Sprache ist mein Markenzeichen."' : 
                                   gate.gate_number === 2 ? '"Meine Worte geben meinem Business Richtung."' : 
                                   gate.gate_number === 3 ? '"Meine Kommunikation bringt Struktur ins Angebot."' :
                                   gate.gate_number === 4 ? '"Ich übersetze komplexe Probleme in verständliche Lösungen."' :
                                   gate.gate_number === 5 ? '"Meine Kommunikation gibt meinem Business Struktur."' :
                                   gate.gate_number === 6 ? '"Meine Kommunikation entscheidet, wer den Raum betritt."' :
                                   gate.gate_number === 7 ? '"Meine Worte positionieren mich als Leader."' :
                                   gate.gate_number === 8 ? '"Meine Sprache macht meinen Beitrag sichtbar."' :
                                   gate.gate_number === 9 ? '"Ich fokussiere meine Botschaft."' :
                                   gate.gate_number === 10 ? '"Meine Kommunikation ist meine Marke."' :
                                   gate.gate_number === 11 ? '"Meine Kommunikation inspiriert Märkte."' :
                                   gate.gate_number === 12 ? '"Meine Worte setzen den entscheidenden Impuls."' :
                                   gate.gate_number === 13 ? '"Ich höre den Markt, bevor ich spreche."' :
                                   gate.gate_number === 14 ? '"Meine Worte lenken Geld- und Energieflüsse."' :
                                   gate.gate_number === 15 ? '"Meine Kommunikation schafft Balance im Markt."' :
                                   gate.gate_number === 16 ? '"Meine Worte wecken Kaufmotivation."' :
                                   gate.gate_number === 17 ? '"Meine Worte geben meiner Marke eine klare Haltung."' :
                                   gate.gate_number === 18 ? '"Meine Worte steigern Qualität."' :
                                   gate.gate_number === 19 ? '"Meine Kommunikation baut Kundenbeziehungen auf."' :
                                   gate.gate_number === 20 ? '"Meine Worte bringen mein Business in den Moment."' :
                                   gate.gate_number === 21 ? '"Meine Kommunikation gibt meinem Business Struktur."' :
                                   gate.gate_number === 22 ? '"Meine Worte öffnen Kundenherzen."' :
                                   gate.gate_number === 23 ? '"Meine Kommunikation macht mein Angebot verständlich."' :
                                   gate.gate_number === 24 ? '"Meine Worte geben meinem Business Tiefe."' :
                                   gate.gate_number === 25 ? '"Meine Worte bringen Echtheit ins Business."' :
                                   gate.gate_number === 26 ? '"Ich positioniere mich durch wirkungsvolle Kommunikation."' :
                                   gate.gate_number === 27 ? '"Meine Worte stärken mein Team und meine Kunden."' :
                                   gate.gate_number === 28 ? '"Ich spreche über den tieferen Wert meiner Arbeit."' :
                                   gate.gate_number === 29 ? '"Meine Worte schaffen Vertrauen durch Verbindlichkeit."' :
                                   gate.gate_number === 30 ? '"Ich verkaufe durch emotionale Verbindung."' :
                                   gate.gate_number === 31 ? '"Meine Worte positionieren mich als Leader."' :
                                   gate.gate_number === 32 ? '"Ich sichere den langfristigen Wert meiner Arbeit."' :
                                   gate.gate_number === 33 ? '"Meine Worte machen meine Geschichte zu einem Asset."' :
                                   gate.gate_number === 34 ? '"Ich bringe durch meine Worte Projekte in Bewegung."' :
                                   gate.gate_number === 35 ? '"Meine Worte erzählen die Reise meines Angebots."' :
                                   gate.gate_number === 36 ? '"Ich nutze meine Sprache, um Wandel zu begleiten."' :
                                   gate.gate_number === 37 ? '"Meine Worte stärken mein Team."' :
                                   gate.gate_number === 38 ? '"Ich positioniere mich klar zu dem, wofür ich stehe."' :
                                   gate.gate_number === 39 ? '"Meine Worte brechen Muster auf."' :
                                   gate.gate_number === 40 ? '"Ich schaffe Vertrauen durch klare Zusagen."' :
                                   gate.gate_number === 41 ? '"Ich starte durch meine Kommunikation neue Projekte."' :
                                   gate.gate_number === 42 ? '"Ich führe Projekte bis zur Reife."' :
                                   '"Meine Worte bringen Innovation."')}
                                </Typography>
                                <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 2 }}>
                                  {gate.consciousness}
                                </Typography>
                                <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.8)' }}>
                                  {gate.business_description || getBusinessDescription(gate.gate_number)}
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>
                        </>
                      ) : (
                        <>
                          {/* Standard-Anzeige für alle anderen Gates */}
                          <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 2 }}>
                            {gate.description || 'Merkur Kommunikation und Denken'}
                          </Typography>
                          <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.9)', marginBottom: 2, fontWeight: 500 }}>
                            {gate.description || 'Merkur Kommunikation und Denken in diesem Gate'}
                          </Typography>
                        </>
                      )}
                      
                      <Box sx={{ marginBottom: 2 }}>
                        <Typography variant="body2" style={{ color: '#FF6B6B', marginBottom: 1, fontWeight: 600 }}>
                          Schatten-Aspekte:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {gate.shadow_aspects ? (typeof gate.shadow_aspects === 'string' ? JSON.parse(gate.shadow_aspects) : gate.shadow_aspects).map((aspect: string, idx: number) => (
                            <Chip 
                              key={idx} 
                              label={aspect} 
                              size="small" 
                              sx={{ 
                                backgroundColor: 'rgba(255,107,107,0.2)',
                                color: '#FF6B6B',
                                fontSize: '10px'
                              }} 
                            />
                          )) : (
                            <Chip 
                              label="Kommunikationsblockaden" 
                              size="small" 
                              sx={{ 
                                backgroundColor: 'rgba(255,107,107,0.2)',
                                color: '#FF6B6B',
                                fontSize: '10px'
                              }} 
                            />
                          )}
                        </Box>
                      </Box>

                      <Box sx={{ marginBottom: 2 }}>
                        <Typography variant="body2" style={{ color: '#4CAF50', marginBottom: 1, fontWeight: 600 }}>
                          Geschenke:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {gate.gifts ? (typeof gate.gifts === 'string' ? JSON.parse(gate.gifts) : gate.gifts).map((gift: string, idx: number) => (
                            <Chip 
                              key={idx} 
                              label={gift} 
                              size="small" 
                              sx={{ 
                                backgroundColor: 'rgba(76,175,80,0.2)',
                                color: '#4CAF50',
                                fontSize: '10px'
                              }} 
                            />
                          )) : (
                            <Chip 
                              label="Kommunikative Geschenke" 
                              size="small" 
                              sx={{ 
                                backgroundColor: 'rgba(76,175,80,0.2)',
                                color: '#4CAF50',
                                fontSize: '10px'
                              }} 
                            />
                          )}
                        </Box>
                      </Box>

                      <Box sx={{ 
                        p: 2, 
                        background: 'rgba(135,206,235,0.1)', 
                        borderRadius: 2, 
                        border: '1px solid rgba(135,206,235,0.3)'
                      }}>
                        <Typography variant="body2" style={{ color: '#87CEEB', fontWeight: 600, marginBottom: 1 }}>
                          Kommunikations-Affirmation:
                        </Typography>
                        <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.9)', fontStyle: 'italic' }}>
                          {gate.affirmation || 'Ich kommuniziere klar und authentisch. Meine Worte sind wertvoll und heilend.'}
                        </Typography>
                      </Box>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </List>
          </Card>
        </motion.div>

        {/* Mercury in Centers */}
        <motion.div
          
          
          
        >
          <Card sx={{
            background: 'linear-gradient(135deg, rgba(11,13,18,0.9) 0%, rgba(26,31,43,0.95) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: 3,
            border: '1px solid #87CEEB',
            boxShadow: '0 8px 32px rgba(135, 206, 235, 0.2)',
            p: 3
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
              <Crown size={24} color="#87CEEB" />
              <Typography variant="h5" sx={{ marginLeft: 2, fontWeight: 600, color: 'white' }}>
                Merkur in den Centers
              </Typography>
            </Box>
            <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 3, fontStyle: 'italic' }}>
              Merkur in den 9 Centers zeigt, wo unsere Kommunikation und unser Denken am stärksten wirken.
            </Typography>
            <List>
              {planetCenters?.map((center, index) => (
                <Accordion key={index} sx={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  marginBottom: 1,
                  '&:before': { display: 'none' },
                  '&.Mui-expanded': { margin: '0 0 8px 0' }
                }}>
                  <AccordionSummary
                    expandIcon={<ChevronDown color="#87CEEB" />}
                    sx={{ 
                      '& .MuiAccordionSummary-content': { 
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, #87CEEB, #5F9EA0)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 2
                      }}>
                        <Crown size={20} color="#000" />
                      </Box>
                      <Box>
                        <Typography variant="h6" style={{ color: 'white', fontWeight: 600 }}>
                          {center.center_name}
                        </Typography>
                        <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.7)' }}>
                          {center.description || 'Merkur Kommunikation'}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip 
                      label="Denken" 
                      size="small" 
                      sx={{ 
                        backgroundColor: 'rgba(135,206,235,0.2)',
                        color: '#87CEEB',
                        fontSize: '10px'
                      }} 
                    />
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ pl: 6 }}>
                      <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 2 }}>
                        {center.description || 'Merkur Kommunikation in diesem Center'}
                      </Typography>
                      <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.9)', marginBottom: 2, fontWeight: 500 }}>
                        {center.description || 'Merkur Kommunikation und Denken in diesem Center'}
                      </Typography>
                      
                      <Box sx={{ marginBottom: 2 }}>
                        <Typography variant="body2" style={{ color: '#FF6B6B', marginBottom: 1, fontWeight: 600 }}>
                          Schatten-Aspekte:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {center.shadow_aspects ? (typeof center.shadow_aspects === 'string' ? JSON.parse(center.shadow_aspects) : center.shadow_aspects).map((aspect: string, idx: number) => (
                            <Chip 
                              key={idx} 
                              label={aspect} 
                              size="small" 
                              sx={{ 
                                backgroundColor: 'rgba(255,107,107,0.2)',
                                color: '#FF6B6B',
                                fontSize: '10px'
                              }} 
                            />
                          )) : (
                            <Chip 
                              label="Kommunikationsblockaden" 
                              size="small" 
                              sx={{ 
                                backgroundColor: 'rgba(255,107,107,0.2)',
                                color: '#FF6B6B',
                                fontSize: '10px'
                              }} 
                            />
                          )}
                        </Box>
                      </Box>

                      <Box sx={{ marginBottom: 2 }}>
                        <Typography variant="body2" style={{ color: '#4CAF50', marginBottom: 1, fontWeight: 600 }}>
                          Geschenke:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {center.gifts ? (typeof center.gifts === 'string' ? JSON.parse(center.gifts) : center.gifts).map((gift: string, idx: number) => (
                            <Chip 
                              key={idx} 
                              label={gift} 
                              size="small" 
                              sx={{ 
                                backgroundColor: 'rgba(76,175,80,0.2)',
                                color: '#4CAF50',
                                fontSize: '10px'
                              }} 
                            />
                          )) : (
                            <Chip 
                              label="Kommunikative Geschenke" 
                              size="small" 
                              sx={{ 
                                backgroundColor: 'rgba(76,175,80,0.2)',
                                color: '#4CAF50',
                                fontSize: '10px'
                              }} 
                            />
                          )}
                        </Box>
                      </Box>

                      <Box sx={{ 
                        p: 2, 
                        background: 'rgba(135,206,235,0.1)', 
                        borderRadius: 2, 
                        border: '1px solid rgba(135,206,235,0.3)'
                      }}>
                        <Typography variant="body2" style={{ color: '#87CEEB', fontWeight: 600, marginBottom: 1 }}>
                          Kommunikations-Affirmation:
                        </Typography>
                        <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.9)', fontStyle: 'italic' }}>
                          {center.affirmation || 'Ich kommuniziere klar und authentisch in diesem Center. Meine Worte sind wertvoll und heilend.'}
                        </Typography>
                      </Box>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </List>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
}
