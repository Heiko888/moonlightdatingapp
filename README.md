# 🌙 HD App - Human Design Dating & Coaching Platform

Eine moderne Webanwendung für Human Design Dating, Coaching und persönliche Entwicklung.

## 🚀 **Architektur**

**Frontend-only mit Supabase Backend:**
- **Next.js 15** - React Framework
- **Supabase** - Backend-as-a-Service (Auth, Database, Storage)
- **Material-UI** - UI Components
- **TypeScript** - Type Safety

## 📋 **Features**

### **Free Plan:**
- ✅ Grundlegendes Human Design Chart
- ✅ Mondkalender
- ✅ Community Hub
- ✅ Journal

### **Basic Plan:**
- ✅ Erweiterte Chart-Analyse
- ✅ Dating-System
- ✅ Coaching-Übersicht

### **Premium Plan:**
- ✅ Chart Comparison
- ✅ Personal Readings
- ✅ Erweiterte Analytics
- ✅ VIP Community

### **VIP Plan:**
- ✅ Personal Coach
- ✅ API Access
- ✅ Advanced Analytics
- ✅ Exclusive Events

## 🛠️ **Setup**

### **1. Repository klonen:**
```bash
git clone https://github.com/Heiko888/moonlightdatingapp.git
cd moonlightdatingapp
```

### **2. Frontend starten:**
```bash
npm run dev
```

### **3. App öffnen:**
- **Local:** http://localhost:3000
- **Hetzner:** http://138.199.237.34:3000

## 🔧 **Entwicklung**

### **Scripts:**
```bash
npm run dev      # Development Server
npm run build    # Production Build
npm run start    # Production Server
npm run lint     # Code Linting
```

### **Struktur:**
```
frontend/
├── app/                 # Next.js App Router
├── components/          # React Components
├── lib/                 # Utilities & Services
├── public/              # Static Assets
└── styles/              # CSS & Themes
```

## 🌐 **Deployment**

### **Hetzner Server:**
```bash
# SSH zum Server
ssh root@138.199.237.34

# App starten
cd /opt/hd-app/HD_App_chart/frontend
npm run dev
```

### **Vercel (Empfohlen):**
```bash
# Vercel CLI installieren
npm install -g vercel

# Deployen
cd frontend
vercel --prod
```

## 🔑 **Umgebung**

### **Supabase Konfiguration:**
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 📱 **Zugriff**

- **Frontend:** http://localhost:3000
- **Hetzner:** http://138.199.237.34:3000
- **Supabase Dashboard:** [supabase.com](https://supabase.com)

## 🎯 **Nächste Schritte**

1. **AccessControl** für `/chart` und `/bodygraph-advanced`
2. **Info-Seiten** erstellen
3. **Vercel Deployment** einrichten
4. **Domain** konfigurieren

---

**🎉 Die HD App läuft jetzt sauber mit nur Frontend + Supabase!**
