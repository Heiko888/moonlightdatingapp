FROM node:20-alpine AS builder

WORKDIR /app

# Kopiere package.json und package-lock.json
COPY package*.json ./

# Installiere Abhängigkeiten
RUN npm install --legacy-peer-deps

# Kopiere den Quellcode
COPY . .

# Baue die Anwendung
RUN npm run build

# Production Stage
FROM node:20-alpine AS production

WORKDIR /app

# Kopiere package.json und package-lock.json
COPY package*.json ./

# Installiere nur Production-Abhängigkeiten
RUN npm install --only=production --legacy-peer-deps && npm cache clean --force

# Kopiere gebauten Code vom Builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./

# Erstelle non-root User
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Ändere Ownership
RUN chown -R nextjs:nodejs /app
USER nextjs

# Exponiere Port 3000
EXPOSE 3000

# Health Check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Starte den Production-Server
CMD ["npm", "start"]
