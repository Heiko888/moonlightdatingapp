'use client';

import React, { useState, useEffect } from 'react';
import AIChatInterface from '../../components/AIChatInterface';
import { Bot, Sparkles, BookOpen, Users } from 'lucide-react';

export default function AIChatPage() {
  const [userChart, setUserChart] = useState(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuliere das Laden von Benutzerdaten
    // In der echten App würden Sie diese aus dem Auth-Context oder localStorage laden
    const loadUserData = async () => {
      try {
        // Beispiel: Lade Benutzer-Chart aus localStorage oder API
        const savedChart = localStorage.getItem('userChart');
        const savedUserId = localStorage.getItem('userId');
        
        if (savedChart) {
          setUserChart(JSON.parse(savedChart));
        }
        
        if (savedUserId) {
          setUserId(savedUserId);
        } else {
          // Fallback: Generiere eine temporäre User-ID
          const tempUserId = `temp_${Date.now()}`;
          setUserId(tempUserId);
          localStorage.setItem('userId', tempUserId);
        }
      } catch (error) {
        console.error('Fehler beim Laden der Benutzerdaten:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Lade AI-Chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                AI Human Design Coach
              </h1>
              <p className="text-gray-600 mt-2">
                Ihr persönlicher Berater für Human Design
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full">
                <Sparkles className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">KI-gestützte Beratung</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Erhalten Sie personalisierte Antworten basierend auf Ihrem Human Design Chart und umfangreichem PDF-Wissen.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">PDF-Wissen Integration</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Zugriff auf professionelle Human Design Literatur und Dokumentation für fundierte Antworten.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-full">
                <Users className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Persönlicher Kontext</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Beratung angepasst an Ihr spezifisches Human Design Chart für maximale Relevanz.
            </p>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            <AIChatInterface 
              userChart={userChart}
              userId={userId || undefined}
              className="h-[600px]"
            />
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>
            💡 <strong>Tipp:</strong> Stellen Sie spezifische Fragen zu Ihrem Human Design Chart, 
            Ihrer Strategie, Autorität oder anderen Aspekten Ihres Designs.
          </p>
        </div>
      </div>
    </div>
  );
}

