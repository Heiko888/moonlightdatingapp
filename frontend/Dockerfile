FROM node:18-alpine

WORKDIR /app

# Kopiere package.json und package-lock.json
COPY package*.json ./

# Installiere Abhängigkeiten
RUN npm install --legacy-peer-deps

# Kopiere den Quellcode
COPY . .

# Exponiere Port 3000
EXPOSE 3000

# Starte den Entwicklungsserver
CMD ["npm", "run", "dev"]
