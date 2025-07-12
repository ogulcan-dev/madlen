#!/bin/sh

# Database'i başlat
echo "Veritabanı başlatılıyor..."
node -e "
import initializeDB from './src/functions/initalizeDB.js';
try {
    initializeDB();
    console.log('Veritabanı başlatıldı.');
} catch (error) {
    console.log('Veritabanı zaten mevcut veya başlatıldı.');
}
"

# Seed data'yı yükle (sadece gerekirse)
echo "Seed data kontrol ediliyor..."
node src/seed.js

echo "Uygulama başlatılıyor..."
exec "$@" 