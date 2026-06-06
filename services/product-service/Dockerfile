FROM node:18-alpine

WORKDIR /app

# Copier package.json et package-lock.json (s'il existe)
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code
COPY . .

# Exposer le port
EXPOSE 3002

# Démarrer le service
CMD ["npm", "start"]
