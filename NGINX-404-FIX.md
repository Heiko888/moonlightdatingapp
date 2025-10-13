# 🔧 NGINX 404-FEHLER BEHEBUNG

**Datum**: 2025-10-14  
**Status**: ✅ Behoben

---

## **📋 PROBLEM**

### **Symptom:**

```text
GET /_next/static/... HTTP/2.0" 404
```

### **Beschreibung:**

Nginx konnte Next.js statische Dateien nicht finden, die unter `/_next/static/` bereitgestellt werden.

### **Auswirkung:**

- ⚠️ Statische Assets (JavaScript, CSS) wurden nicht geladen
- ⚠️ Hot Module Replacement (HMR) funktionierte nicht korrekt
- ⚠️ Potenzielle Performance-Probleme

---

## **🔍 URSACHE**

### **Fehlende Nginx-Konfiguration:**

Die Nginx-Konfiguration hatte keine spezifische `location`-Direktive für Next.js-spezifische Pfade:

- `/_next/static/` - Statische Build-Dateien
- `/_next/webpack-hmr` - Hot Module Replacement

### **Vorherige Konfiguration:**

```nginx
# Nur generische Static Files
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    proxy_pass http://frontend;
}
```

**Problem:** Diese Regel greift nur bei Dateien mit spezifischen Endungen, nicht bei Next.js-spezifischen Pfaden.

---

## **✅ LÖSUNG**

### **Neue Nginx-Konfiguration:**

#### **1. Next.js Static Files:**

```nginx
# Next.js static files
location /_next/static/ {
    proxy_pass http://frontend;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_cache_valid 200 365d;
    add_header Cache-Control "public, immutable";
    expires 365d;
}
```

**Features:**

- ✅ Spezifische Regel für `/_next/static/`
- ✅ Lange Cache-Dauer (365 Tage)
- ✅ Immutable Cache-Control
- ✅ Proxy zu Frontend-Container

#### **2. Next.js Webpack HMR:**

```nginx
# Next.js webpack HMR
location /_next/webpack-hmr {
    proxy_pass http://frontend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
}
```

**Features:**

- ✅ WebSocket-Unterstützung für HMR
- ✅ Upgrade-Header für WebSocket-Verbindung
- ✅ Echtzeit-Updates während Entwicklung

---

## **📝 IMPLEMENTIERUNG**

### **Betroffene Dateien:**

#### **1. nginx/nginx-dev.conf**

```bash
# Development-Konfiguration
✅ Aktualisiert mit Next.js-spezifischen Regeln
✅ Konfiguration getestet
✅ Nginx neu geladen
```

#### **2. nginx/nginx.conf**

```bash
# Production-Konfiguration
✅ Aktualisiert mit Next.js-spezifischen Regeln
✅ Konfiguration getestet
✅ Bereit für Production-Deployment
```

### **Deployment-Schritte:**

```powershell
# 1. Konfiguration testen
docker-compose -f docker-compose.dev.yml exec nginx nginx -t

# 2. Nginx neu laden
docker-compose -f docker-compose.dev.yml exec nginx nginx -s reload

# 3. Logs prüfen
docker logs hd_app_chart-nginx-1 --tail 50

# 4. Funktionalität testen
# http://localhost:80
```

---

## **🧪 TESTING**

### **1. Static Files Test:**

```bash
# Browser DevTools → Network Tab
# Prüfe: /_next/static/chunks/...
# Erwarteter Status: 200 OK
# Cache-Control: public, immutable
```

### **2. HMR Test:**

```bash
# Development Server läuft
# Ändere eine Datei
# Erwartetes Verhalten: Automatisches Reload ohne 404
```

### **3. Performance Test:**

```bash
# Lighthouse Audit
# Erwartete Verbesserung:
# - Schnellere Ladezeiten
# - Bessere Cache-Nutzung
# - Keine 404-Fehler
```

---

## **📊 VORHER / NACHHER**

### **Vorher:**

```text
❌ GET /_next/static/chunks/app-pages-internals.js 404
❌ GET /_next/webpack-hmr 404
⚠️  Langsame Ladezeiten
⚠️  HMR funktioniert nicht
```

### **Nachher:**

```text
✅ GET /_next/static/chunks/app-pages-internals.js 200
✅ GET /_next/webpack-hmr 200 (WebSocket)
✅ Schnelle Ladezeiten (Cache)
✅ HMR funktioniert einwandfrei
```

---

## **🎯 WEITERE OPTIMIERUNGEN**

### **1. Nginx Cache:**

```nginx
# Optional: Nginx Caching Layer
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=nextjs_cache:10m max_size=1g inactive=60m;

location /_next/static/ {
    proxy_cache nextjs_cache;
    proxy_cache_valid 200 365d;
    proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
    # ... rest of config
}
```

### **2. Brotli Compression:**

```nginx
# Zusätzlich zu Gzip
brotli on;
brotli_comp_level 6;
brotli_types text/plain text/css text/xml text/javascript application/json application/javascript;
```

### **3. HTTP/2 Push:**

```nginx
# Proaktives Pushen kritischer Assets
location / {
    http2_push /\_next/static/css/main.css;
    http2_push /\_next/static/js/main.js;
    # ... rest of config
}
```

---

## **📚 BEST PRACTICES**

### **Next.js + Nginx:**

#### **1. Static Assets:**

- ✅ Lange Cache-Dauer (365 Tage)
- ✅ Immutable Cache-Control
- ✅ Spezifische Location-Blöcke

#### **2. Development:**

- ✅ HMR WebSocket-Unterstützung
- ✅ Keine Cache während Entwicklung
- ✅ Proxy-Timeouts erhöhen

#### **3. Production:**

- ✅ Gzip/Brotli Compression
- ✅ HTTP/2 aktiviert
- ✅ Security Headers
- ✅ Rate Limiting

---

## **🔍 MONITORING**

### **Nginx Logs überwachen:**

```powershell
# Access Logs
docker logs hd_app_chart-nginx-1 -f | Select-String "/_next"

# Error Logs
docker logs hd_app_chart-nginx-1 -f | Select-String "error"

# 404 Errors
docker logs hd_app_chart-nginx-1 -f | Select-String "404"
```

### **Metriken in Prometheus:**

```yaml
# nginx_http_requests_total
# nginx_http_request_duration_seconds
# nginx_http_response_size_bytes
```

---

## **✅ CHECKLISTE**

### **Development:**

- [x] nginx-dev.conf aktualisiert
- [x] Konfiguration getestet
- [x] Nginx neu geladen
- [x] Static Files funktionieren
- [x] HMR funktioniert

### **Production:**

- [x] nginx.conf aktualisiert
- [x] Konfiguration getestet
- [ ] Production-Deployment
- [ ] Live-Tests durchführen
- [ ] Performance-Monitoring

---

## **📖 REFERENZEN**

- [Next.js Static File Serving](https://nextjs.org/docs/basic-features/static-file-serving)
- [Nginx Proxy Configuration](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)
- [Nginx Caching Guide](https://www.nginx.com/blog/nginx-caching-guide/)
- [WebSocket Proxying](https://nginx.org/en/docs/http/websocket.html)

---

**Status**: ✅ Problem behoben und dokumentiert  
**Nächste Schritte**: Production-Deployment und Monitoring
