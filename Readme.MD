# Quiz Uygulaması - İnteraktif  Testi API'si ve UI'si

Bu uygulama, öğrencilerin bilgilerini test etmelerine olanak sağlayan full-stack bir web uygulamasıdır. React tabanlı frontend ve Node.js/Express backend ile geliştirilmiştir.

## Özellikler

- **Quiz Yönetimi**: Veritabanından quiz listesini getirir ve kullanıcıya sunar
- **Otomatik Puanlama**: Verilen cevapları otomatik olarak değerlendirir ve puan hesaplar
- **Responsive Tasarım**: Mobil ve masaüstü cihazlarda uyumlu çalışır

## Gereksinimler

- Node.js 16.x veya üzeri
- React 19.x
- Express.js 5.x
- SQLite3 (better-sqlite3)
- Tailwind CSS 3.x (Techstackte istemediğizin farkındayım. Ama daha iyi tasarım deneyimi olması için kullandım.)
- React Router DOM 7.x
- Docker ve Docker Compose (opsiyonel)

## Teknik Mimari

### Backend (Node.js/Express)
- **Veritabanı**: SQLite3 ile veri saklama
- **API Endpoints**: RESTful API yapısı
- **Güvenlik**: CORS politikası ve HTTP method kısıtlaması
- **Hata Yönetimi**: Kapsamlı hata yakalama ve işleme

### Frontend (React)
- **State Yönetimi**: React Hooks (useState, useEffect, useCallback)
- **Routing**: React Router DOM ile sayfa yönlendirme
- **Styling**: Tailwind CSS ile modern tasarım
- **API İletişimi**: Fetch API ile backend entegrasyonu

## Veritabanı Yapısı

```sql
-- Quizler
quizs (id, title)

-- Sorular  
quiz_questions (id, quiz_id, question_text)

-- Cevap seçenekleri
quiz_sections (id, quiz_question_id, option_text, is_correct)

-- Kullanıcı cevapları
quiz_answers (id, quiz_id, quiz_question_id, selected_option_id)

-- Sonuçlar
quiz_results (id, quiz_id, score)
```

## Kurulum ve Çalıştırma

### Docker ile Kurulum (Önerilen)
```bash
# Tüm servisleri Docker ile başlat
docker-compose up --build

# Arka planda çalıştırmak için
docker-compose up -d --build

# Servisleri durdur
docker-compose down
```

### Manuel Kurulum

#### Backend Kurulumu
```bash
cd backend
npm install
npm run dev
```

#### Frontend Kurulumu  
```bash
cd frontend
npm install
npm start
```

#### Veritabanı Hazırlama
```bash
cd backend
node src/seed.js
```

### Docker Konfigürasyonu

Proje Docker ve Docker Compose ile tam otomatik kurulum destekler:

- **Backend Container**: Node.js 20 tabanlı, port 3001
- **Frontend Container**: React development server, port 3000
- **Volume Mounting**: Veritabanı kalıcılığı için
- **Network**: Container'lar arası iletişim

## Güvenlik Özellikleri

- **CORS Politikası**: Sadece izin verilen kaynaklardan erişim
- **HTTP Method Kısıtlaması**: Sadece GET ve POST isteklerine izin
- **Input Validasyonu**: Gelen verilerin doğrulanması
- **SQL Injection Koruması**: Prepared statements kullanımı
- **Hata Yönetimi**: Güvenli hata mesajları

## Performans Optimizasyonları

- **React Hooks**: useCallback ile fonksiyon optimizasyonu
- **Database Indexing**: Hızlı veri erişimi için indeksleme
- **Lazy Loading**: İhtiyaç anında bileşen yükleme
- **State Management**: Efficient state updates
- **Docker Multi-stage Build**: Optimize edilmiş container boyutları
- **Container Orchestration**: Docker Compose ile servis yönetimi

## Ek Bilgiler

- Tüm sorular çoktan seçmeli format ile hazırlanmıştır
- Sistem otomatik puanlama ve anında sonuç gösterimi sağlar. Puanlama sistemini UI'ye eklemedim. Benden basit bir tasarım istediğiniz için. 
- Responsive tasarım ile tüm cihazlarda kullanılabilir
- Quiz soruları tamamen yapay zeka tarafından oluşturuldu.
- Cursor ve ChatGPT'yi geliştirme sürecimi hızlandırmak için kullandım. Projelerimi geliştirirken başta Cursor olmak üzere yapay zeka araçlarını etkili bir şekilde kullanmayı seviyorum. Hem iş yükümü azaltıyor, hem projeyi daha hızlı geliştirmeme katkıda bulunuyor.

## Yardım aldığım kaynaklar.
[Tailwind Dökümantasyonu](https://tailwindcss.com)
[React Dökümantasyonu](https://create-react-app.dev/docs/getting-started/)
[ChatGPT](https://chat.com) 
[Cursor](https://www.cursor.com)
[ExpressJS Dökümasntasyonu](https://expressjs.com)

