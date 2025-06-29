# Utilise node officiel stable
FROM node:18-alpine

# Définit le répertoire de travail
WORKDIR /app

# Copie package.json et package-lock.json (si présent)
COPY package*.json ./

# Installe les dépendances
RUN npm install --production

# Copie tout le code
COPY . .

# Expose le port défini
EXPOSE 3000

# Démarre le serveur
CMD ["npm", "start"]
