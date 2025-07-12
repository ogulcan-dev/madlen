# Node.js 20 tabanlı resmi imaj kullan
FROM node:20-alpine

# Çalışma dizinini ayarla
WORKDIR /app

# Package.json ve package-lock.json dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm ci

# Uygulama kodunu kopyala
COPY . .

# Port 3000'i expose et (React dev server)
EXPOSE 3000

# React development server'ı başlat
CMD ["npm", "start"] 