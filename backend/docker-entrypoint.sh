#!/bin/sh

echo "Veritabanı ve seed data başlatılıyor..."
node -e "
import initializeDB from './src/functions/initalizeDB.js';
try {
    initializeDB();
    console.log('Veritabanı ve seed data hazırlandı.');
} catch (error) {
    console.error('Veritabanı başlatma hatası:', error);
}
"

echo "Uygulama başlatılıyor..."
exec "$@" 