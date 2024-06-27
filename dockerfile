# Utilisation de l'image de base officielle Node.js
FROM node:20

# Définition du répertoire de travail dans le conteneur
WORKDIR /app

# Copie des fichiers de package et installation des dépendances
COPY package*.json ./
RUN npm install

# Copie du reste de l'application
COPY . .

# Construction de l'application
RUN npm run build

# Utilisation d'une image de serveur web pour servir l'application
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html

# Exposition du port sur lequel l'application va tourner
EXPOSE 80

# Commande pour démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
