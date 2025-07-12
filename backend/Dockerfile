# Node.js 20 tabanlı resmi imaj kullan (better-sqlite3 için gerekli)
FROM node:20-alpine

# Build araçlarını yükle (better-sqlite3 için gerekli)
RUN apk add --no-cache python3 make g++

# Çalışma dizinini ayarla
WORKDIR /app

# Package.json ve package-lock.json dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm ci --omit=dev

# Uygulama kodunu kopyala
COPY src/ ./src/

# Entrypoint script'ini kopyala
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Database dizinini oluştur
RUN mkdir -p src/database

# Port 3000'i expose et
EXPOSE 3000

# Entrypoint'i ayarla
ENTRYPOINT ["docker-entrypoint.sh"]

# Uygulamayı çalıştır
CMD ["npm", "start"] 