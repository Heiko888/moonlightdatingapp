import { NextResponse } from 'next/server';

export async function GET() {
  console.log('Lilith Gates API aufgerufen');
  
  // Fallback-Daten für die ersten 10 Gates
  const fallbackData = [
    {
      gate: 1,
      name: "Der Schöpfer",
      description: "Lilith in Tor 1 bringt die Kraft der Schöpfung und des Ausdrucks. Du hast die Fähigkeit, deine kreative Energie wild und ungezähmt zu leben.",
      deep_meaning: "Die tiefe Bedeutung liegt in der natürlichen Kreativität. Du erkennst, dass dein Schaffen nicht gezähmt werden will, sondern wild und frei fließen muss.",
      shadow_aspects: "Unbewusste Angst vor zu viel Ausdruck, Zurückhaltung des Feuers, Scham über die eigene Kreativität",
      gifts: "Instinktives Schaffen, Lava-artige Kreativität, Selbstversöhnende Kraft",
      affirmation: "Ich lebe Tor 1 mit wilder Lilith Kraft. Mein Schaffen ist wild und instinktiv.",
      unconscious_description: "Tief in dir liegt eine rohe Angst: dass dein Ausdruck zu viel ist. Unbewusst hast du dich klein gemacht, dein Feuer zurückgehalten, damit es niemanden blendet.",
      unconscious_deep_meaning: "Dein Schaffen ist instinktiv, es bricht hervor wie Lava. Und wenn du es nicht mehr drosselst, wird es zur Kraft, die dich mit dir selbst versöhnt.",
      unconscious_shadow_aspects: "Unbewusste Angst vor zu viel Ausdruck, Zurückhaltung des Feuers, Scham über die eigene Kreativität",
      unconscious_gifts: "Instinktives Schaffen, Lava-artige Kreativität, Selbstversöhnende Kraft",
      unconscious_affirmation: "Ich lebe Tor 1 unbewusst mit wilder Lilith Kraft. Mein Schaffen ist wild und instinktiv."
    },
    {
      gate: 2,
      name: "Die Rezeptive",
      description: "Lilith in Tor 2 bringt die Kraft der Rezeptivität und des Empfangens. Du hast die Fähigkeit, Energie zu empfangen und zu nähren.",
      deep_meaning: "Die tiefe Bedeutung liegt in der natürlichen Rezeptivität. Du verstehst, dass Empfangen keine Schwäche ist, sondern eine wilde Kraft.",
      shadow_aspects: "Unbewusste Scham über Empfangen, Angst vor Schwäche, Unterdrückung des natürlichen Magnetismus",
      gifts: "Wilde Rezeptivität, Ungezähmter Magnetismus, Öffnende Kraft",
      affirmation: "Ich lebe Tor 2 mit wilder Lilith Kraft. Mein Empfangen ist wild und magnetisch.",
      unconscious_description: "Vielleicht sitzt tief in dir die Scham, dass Empfangen schwach ist. Also hast du versucht, stärker, aktiver, kontrollierender zu sein, als dein Wesen eigentlich will.",
      unconscious_deep_meaning: "Doch in deinem Körper lebt die wilde Wahrheit: deine größte Kraft liegt darin, zu öffnen, nicht zu machen. Dein Magnetismus ist ungezähmt. Du ziehst an, weil du empfängst.",
      unconscious_shadow_aspects: "Unbewusste Scham über Empfangen, Angst vor Schwäche, Unterdrückung des natürlichen Magnetismus",
      unconscious_gifts: "Wilde Rezeptivität, Ungezähmter Magnetismus, Öffnende Kraft",
      unconscious_affirmation: "Ich lebe Tor 2 unbewusst mit wilder Lilith Kraft. Mein Empfangen ist wild und magnetisch."
    },
    {
      gate: 3,
      name: "Ordnung aus Chaos",
      description: "Lilith in Tor 3 bringt die Kraft des Chaos und der Ordnung. Du hast die Fähigkeit, aus dem Chaos neue Strukturen zu schaffen.",
      deep_meaning: "Die tiefe Bedeutung liegt im Verständnis, dass Chaos schöpferisch ist. Du erkennst, dass aus der Zerstörung des Alten das Neue geboren wird.",
      shadow_aspects: "Unbewusste Scham über Chaos, Angst vor Unruhe, Unterdrückung der schöpferischen Zerstörung",
      gifts: "Heiliges Chaos, Schöpferische Zerstörung, Form findende Unruhe",
      affirmation: "Ich lebe Tor 3 mit wilder Lilith Kraft. Mein Chaos ist wild und schöpferisch.",
      unconscious_description: "Unbewusst spürst du das Chaos in dir – und vielleicht schämst du dich dafür. Also versuchst du, Ordnung zu erzwingen, wo dein Instinkt eigentlich Neues hervorbringen will.",
      unconscious_deep_meaning: "Doch Lilith hier macht deine Unruhe heilig. Dein Chaos ist schöpferisch. Wenn du dich ihm hingibst, wächst aus der Zerstörung Altes, und das Neue findet Form.",
      unconscious_shadow_aspects: "Unbewusste Scham über Chaos, Angst vor Unruhe, Unterdrückung der schöpferischen Zerstörung",
      unconscious_gifts: "Heiliges Chaos, Schöpferische Zerstörung, Form findende Unruhe",
      unconscious_affirmation: "Ich lebe Tor 3 unbewusst mit wilder Lilith Kraft. Mein Chaos ist wild und schöpferisch."
    },
    {
      gate: 4,
      name: "Antworten",
      description: "Lilith in Tor 4 bringt die Kraft der Antworten und der Klarheit. Du hast die Fähigkeit, tiefe Antworten zu finden.",
      deep_meaning: "Die tiefe Bedeutung liegt in der natürlichen Weisheit. Du verstehst, dass Antworten nicht logisch sein müssen, sondern aus der Intuition kommen.",
      shadow_aspects: "Unbewusste Angst vor unlogischen Antworten, Scham über Intuition, Unterdrückung der rohen Wahrheit",
      gifts: "Roh spürende Antworten, Intuitive Wahrheit, Unbegründete Klarheit",
      affirmation: "Ich lebe Tor 4 mit wilder Lilith Kraft. Meine Antworten sind wild und intuitiv.",
      unconscious_description: "Tief in dir lebt die Angst, keine logische Antwort zu haben. Also redest du manchmal gegen dein Gefühl an, um 'richtig' zu wirken.",
      unconscious_deep_meaning: "Doch dein Körper weiß: deine Antworten sind nicht glatt, sie sind roh, direkt, ungezähmt. Lilith in dir spricht durch Intuition, nicht durch Beweise. Und genau diese unbegründete Wahrheit ist dein Geschenk.",
      unconscious_shadow_aspects: "Unbewusste Angst vor unlogischen Antworten, Scham über Intuition, Unterdrückung der rohen Wahrheit",
      unconscious_gifts: "Roh spürende Antworten, Intuitive Wahrheit, Unbegründete Klarheit",
      unconscious_affirmation: "Ich lebe Tor 4 unbewusst mit wilder Lilith Kraft. Meine Antworten sind wild und intuitiv."
    },
    {
      gate: 5,
      name: "Der Rhythmus",
      description: "Lilith in Tor 5 bringt die Kraft des Rhythmus und der Zeit. Du hast die Fähigkeit, in deinem eigenen Rhythmus zu leben.",
      deep_meaning: "Die tiefe Bedeutung liegt im Verständnis, dass jeder seinen eigenen Rhythmus hat. Du erkennst, dass dein Takt nicht dem der anderen entsprechen muss.",
      shadow_aspects: "Unbewusste Scham über eigenen Rhythmus, Angst vor Unpassendheit, Unterdrückung des wilden Takts",
      gifts: "Wilder Rhythmus, Lebens folgender Takt, Echter Körperrhythmus",
      affirmation: "Ich lebe Tor 5 mit wilder Lilith Kraft. Mein Rhythmus ist wild und echt.",
      unconscious_description: "Tief in dir lebt die Scham, nicht in den Takt der anderen zu passen. Vielleicht spürst du Unruhe, wenn du gezwungen wirst, in fremden Rhythmen zu marschieren.",
      unconscious_deep_meaning: "Dein Körper rebelliert – mal zu schnell, mal zu langsam, nie 'genau richtig'. Doch Lilith hier weiß: dein Rhythmus ist wild und echt. Dein Takt folgt keinem Kalender, er folgt dem Leben selbst.",
      unconscious_shadow_aspects: "Unbewusste Scham über eigenen Rhythmus, Angst vor Unpassendheit, Unterdrückung des wilden Takts",
      unconscious_gifts: "Wilder Rhythmus, Lebens folgender Takt, Echter Körperrhythmus",
      unconscious_affirmation: "Ich lebe Tor 5 unbewusst mit wilder Lilith Kraft. Mein Rhythmus ist wild und echt."
    },
    {
      gate: 6,
      name: "Die Reibung",
      description: "Lilith in Tor 6 bringt die Kraft der Reibung und der Spannung. Du hast die Fähigkeit, durch Konflikte zu wachsen.",
      deep_meaning: "Die tiefe Bedeutung liegt im Verständnis, dass Reibung lebendig macht. Du erkennst, dass wahre Nähe durch Spannung entsteht.",
      shadow_aspects: "Unbewusste Angst vor Spannung, Scham über Intensität, Unterdrückung der lebendigen Reibung",
      gifts: "Lebendige Reibung, Knistern schaffende Spannung, Wilde Intensität",
      affirmation: "Ich lebe Tor 6 mit wilder Lilith Kraft. Meine Reibung ist wild und lebendig.",
      unconscious_description: "Unbewusst spürst du die Angst vor Spannung. Du weichst Konflikten aus oder übersteigerst sie – und in beiden Fällen schämst du dich für deine Intensität.",
      unconscious_deep_meaning: "Doch Lilith hier liebt die Reibung. Sie macht dich lebendig. Dein Körper weiß: wahre Nähe entsteht nicht im Glatten, sondern im Knistern. Deine Wildheit liegt darin, in dieser Spannung zu bleiben.",
      unconscious_shadow_aspects: "Unbewusste Angst vor Spannung, Scham über Intensität, Unterdrückung der lebendigen Reibung",
      unconscious_gifts: "Lebendige Reibung, Knistern schaffende Spannung, Wilde Intensität",
      unconscious_affirmation: "Ich lebe Tor 6 unbewusst mit wilder Lilith Kraft. Meine Reibung ist wild und lebendig."
    },
    {
      gate: 7,
      name: "Die Führung",
      description: "Lilith in Tor 7 bringt die Kraft der Führung und der Richtung. Du hast die Fähigkeit, andere zu leiten.",
      deep_meaning: "Die tiefe Bedeutung liegt in der natürlichen Führungsqualität. Du verstehst, dass wahre Führung aus innerer Stärke kommt.",
      shadow_aspects: "Unbewusste Angst vor Abstoßung, Scham über Führungsenergie, Unterdrückung der wilden Richtung",
      gifts: "Wilde Führung, Roh spürende Richtung, Ungezähmte Klarheit",
      affirmation: "Ich lebe Tor 7 mit wilder Lilith Kraft. Meine Führung ist wild und klar.",
      unconscious_description: "Vielleicht trägst du tief in dir die Angst, deine Führungsenergie könnte andere abstoßen. Also hältst du dich zurück, obwohl dein Körper spürt, wohin es geht.",
      unconscious_deep_meaning: "Lilith hier will, dass du die rohe Wahrheit anerkennst: du bist gebaut, Richtung zu geben. Nicht höflich, nicht angepasst, sondern wild, klar, ungezähmt.",
      unconscious_shadow_aspects: "Unbewusste Angst vor Abstoßung, Scham über Führungsenergie, Unterdrückung der wilden Richtung",
      unconscious_gifts: "Wilde Führung, Roh spürende Richtung, Ungezähmte Klarheit",
      unconscious_affirmation: "Ich lebe Tor 7 unbewusst mit wilder Lilith Kraft. Meine Führung ist wild und klar."
    },
    {
      gate: 8,
      name: "Der Beitrag",
      description: "Lilith in Tor 8 bringt die Kraft des Beitrags und des Ausdrucks. Du hast die Fähigkeit, deine Stimme zu erheben.",
      deep_meaning: "Die tiefe Bedeutung liegt in der Einzigartigkeit deines Beitrags. Du verstehst, dass dein Lied nicht für alle ist, sondern für die, die es brauchen.",
      shadow_aspects: "Unbewusste Scham über Anderssein, Angst vor Störung, Unterdrückung der einzigartigen Stimme",
      gifts: "Einzigartiger Beitrag, Wertvolles Anderssein, Wilde Stimme",
      affirmation: "Ich lebe Tor 8 mit wilder Lilith Kraft. Mein Beitrag ist wild und einzigartig.",
      unconscious_description: "Unbewusst sitzt die Scham, dass dein Ausdruck nicht passt. Vielleicht glaubst du, dass dein Beitrag seltsam klingt oder störend wirkt.",
      unconscious_deep_meaning: "Doch Lilith hier macht dein Anderssein wertvoll. Dein Lied ist nicht für die Menge, sondern für die, die es brauchen. Dein Körper weiß: deine Wildheit liegt in der Einzigartigkeit deines Beitrags.",
      unconscious_shadow_aspects: "Unbewusste Scham über Anderssein, Angst vor Störung, Unterdrückung der einzigartigen Stimme",
      unconscious_gifts: "Einzigartiger Beitrag, Wertvolles Anderssein, Wilde Stimme",
      unconscious_affirmation: "Ich lebe Tor 8 unbewusst mit wilder Lilith Kraft. Mein Beitrag ist wild und einzigartig."
    },
    {
      gate: 9,
      name: "Die Fokussierung",
      description: "Lilith in Tor 9 bringt die Kraft der Fokussierung und der Konzentration. Du hast die Fähigkeit, dich zu fokussieren.",
      deep_meaning: "Die tiefe Bedeutung liegt im Verständnis, dass Fokus wild ist. Du erkennst, dass dein Fokus der Anziehung folgt, nicht der Pflicht.",
      shadow_aspects: "Unbewusste Scham über Zerstreuung, Angst vor falschem Fokus, Unterdrückung der wilden Anziehung",
      gifts: "Wilder Fokus, Laser-artige Verdichtung, Anziehung folgende Energie",
      affirmation: "Ich lebe Tor 9 mit wilder Lilith Kraft. Mein Fokus ist wild und anziehend.",
      unconscious_description: "Tief in dir lebt die Scham, dass du dich nicht 'richtig' konzentrieren kannst. Dein Körper will manchmal hierhin, manchmal dorthin, und du fürchtest, zerstreut zu wirken.",
      unconscious_deep_meaning: "Doch Lilith in dir weiß: dein Fokus ist wild. Er folgt nicht der Pflicht, sondern der Anziehung. Wenn du dich hingibst, verdichtet sich deine Energie wie ein Laser – genau dort, wo dein Körper Ja sagt.",
      unconscious_shadow_aspects: "Unbewusste Scham über Zerstreuung, Angst vor falschem Fokus, Unterdrückung der wilden Anziehung",
      unconscious_gifts: "Wilder Fokus, Laser-artige Verdichtung, Anziehung folgende Energie",
      unconscious_affirmation: "Ich lebe Tor 9 unbewusst mit wilder Lilith Kraft. Mein Fokus ist wild und anziehend."
    },
    {
      gate: 10,
      name: "Die Selbstliebe",
      description: "Lilith in Tor 10 bringt die Kraft der Selbstliebe und der Selbstakzeptanz. Du hast die Fähigkeit, dich selbst zu lieben.",
      deep_meaning: "Die tiefe Bedeutung liegt in der Unverbogenheit. Du verstehst, dass wahre Selbstliebe bedeutet, dich so zu lieben, wie du wirklich bist.",
      shadow_aspects: "Unbewusste Angst vor Unliebenswertigkeit, Scham über Eigenheiten, Unterdrückung der unverfälschten Art",
      gifts: "Unverbogene Selbstliebe, Roh echte Eigenheiten, Wilde Einzigartigkeit",
      affirmation: "Ich lebe Tor 10 mit wilder Lilith Kraft. Meine Selbstliebe ist wild und echt.",
      unconscious_description: "Vielleicht sitzt in dir die unbewusste Angst, dass du so, wie du bist, nicht liebenswert bist. Also versuchst du, dich anzupassen, dich anders zu bewegen, anders zu zeigen.",
      unconscious_deep_meaning: "Doch Lilith hier erinnert deinen Körper: deine Wildheit liegt im Unverbogenen. Deine Eigenheiten, deine Gesten, deine Art – roh, unverfälscht, einzigartig. Du bist liebenswert, weil du echt bist.",
      unconscious_shadow_aspects: "Unbewusste Angst vor Unliebenswertigkeit, Scham über Eigenheiten, Unterdrückung der unverfälschten Art",
      unconscious_gifts: "Unverbogene Selbstliebe, Roh echte Eigenheiten, Wilde Einzigartigkeit",
      unconscious_affirmation: "Ich lebe Tor 10 unbewusst mit wilder Lilith Kraft. Meine Selbstliebe ist wild und echt."
    }
  ];

  return NextResponse.json(fallbackData);
}