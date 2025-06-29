FROM node:18

# Installer git (Debian/Ubuntu)
RUN apt-get update && apt-get install -y git

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances (production seulement)
RUN npm install --production

# Copier le reste du code
COPY . .

# Démarrer l’application
CMD ["node", "server.js"]
