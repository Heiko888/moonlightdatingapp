import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Moon phases data (fallback)
const moonPhases = [
  {
    name: "Neumond",
    description: "Zeit für Neuanfänge und Intentionen",
    energy: "Ruhe und Reflexion",
    color: "#1a1a2e",
    symbol: "🌑"
  },
  {
    name: "Zunehmender Mond",
    description: "Zeit für Wachstum und Entwicklung",
    energy: "Aufbau und Expansion",
    color: "#16213e",
    symbol: "🌒"
  },
  {
    name: "Vollmond",
    description: "Zeit für Vollendung und Manifestation",
    energy: "Höchste Energie und Klarheit",
    color: "#0f3460",
    symbol: "🌕"
  },
  {
    name: "Abnehmender Mond",
    description: "Zeit für Loslassen und Reinigung",
    energy: "Reflexion und Transformation",
    color: "#533483",
    symbol: "🌘"
  }
]

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const path = url.pathname

    if (path.includes('/current')) {
      // Get current moon phase
      const currentDate = new Date()
      const dayOfMonth = currentDate.getDate()
      const phaseIndex = Math.floor(dayOfMonth / 7) % 4
      const currentPhase = moonPhases[phaseIndex]

      return new Response(
        JSON.stringify({
          success: true,
          phase: currentPhase,
          date: currentDate.toISOString(),
          timestamp: Date.now()
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )

    } else if (path.includes('/phases')) {
      // Get all moon phases
      return new Response(
        JSON.stringify({
          success: true,
          phases: moonPhases
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )

    } else {
      // Default moon calendar data
      const currentDate = new Date()
      const dayOfMonth = currentDate.getDate()
      const phaseIndex = Math.floor(dayOfMonth / 7) % 4
      const currentPhase = moonPhases[phaseIndex]

      // Generate calendar data for current month
      const calendarData = []
      const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
      
      for (let day = 1; day <= daysInMonth; day++) {
        const dayPhaseIndex = Math.floor(day / 7) % 4
        calendarData.push({
          day,
          phase: moonPhases[dayPhaseIndex],
          isToday: day === currentDate.getDate()
        })
      }

      return new Response(
        JSON.stringify({
          success: true,
          currentPhase,
          calendar: calendarData,
          month: currentDate.getMonth() + 1,
          year: currentDate.getFullYear()
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

  } catch (error) {
    console.error('Moon calendar error:', error)
    return new Response(
      JSON.stringify({ error: 'Interner Serverfehler' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
