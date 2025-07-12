//Cursor tarafından yazıldı
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seed = () => {
    const dbPath = path.join(__dirname, "database", "database.db");
    const db = new Database(dbPath);
    
    try {
        // Veritabanında zaten veri var mı kontrol et
        const existingQuizzes = db.prepare("SELECT COUNT(*) as count FROM quizs").get();
        
        if (existingQuizzes.count > 0) {
            console.log("Veritabanında zaten veri mevcut. Seed işlemi atlanıyor.");
            db.close();
            return;
        }
        
        console.log("Veritabanına quizler oluşturulmaya başlanıyor.")
        
        // Transaction başlat
        db.exec("BEGIN TRANSACTION;");
        
        // Quiz başlıklarını ekle
        const insertQuiz = db.prepare("INSERT INTO quizs (title) VALUES (?)");
        insertQuiz.run('Limit Türev İntegral Quiz');
        insertQuiz.run('Genel Kültür Quiz');
        insertQuiz.run('Teknoloji ve Bilişim Quiz');
        
        // Prepared statements
        const insertQuestion = db.prepare("INSERT INTO quiz_questions (quiz_id, question_text) VALUES (?, ?)");
        const insertOption = db.prepare("INSERT INTO quiz_sections (quiz_question_id, option_text, is_correct) VALUES (?, ?, ?)");
        
        // QUIZ 1: MATEMATİK SORULARI
        // Soru 1
        const q1 = insertQuestion.run(1, 'Aşağıdakilerden hangisi limit ile alakalı doğrudur?');
        insertOption.run(q1.lastInsertRowid, 'Limit, bir fonksiyonun bir noktadaki değerini ifade eder.', 1);
        insertOption.run(q1.lastInsertRowid, 'Bir noktada kopma varsa limit yoktur.', 0);
        insertOption.run(q1.lastInsertRowid, 'Her limitli fonksiyon süreklidir.', 0);
        insertOption.run(q1.lastInsertRowid, 'Limit, güzel bir şeydir.', 0);
        
        // Soru 2
        const q2 = insertQuestion.run(1, 'f(x) = x² fonksiyonunun türevi nedir?');
        insertOption.run(q2.lastInsertRowid, '2x', 1);
        insertOption.run(q2.lastInsertRowid, 'x', 0);
        insertOption.run(q2.lastInsertRowid, '2x²', 0);
        insertOption.run(q2.lastInsertRowid, 'x²', 0);
        
        // Soru 3
        const q3 = insertQuestion.run(1, '∫ 2x dx integralinin sonucu nedir?');
        insertOption.run(q3.lastInsertRowid, 'x² + C', 1);
        insertOption.run(q3.lastInsertRowid, '2x² + C', 0);
        insertOption.run(q3.lastInsertRowid, 'x + C', 0);
        insertOption.run(q3.lastInsertRowid, '2 + C', 0);
        
        // QUIZ 2: GENEL KÜLTÜR SORULARI
        // Soru 1
        const q4 = insertQuestion.run(2, 'Türkiye\'nin en büyük gölü hangisidir?');
        insertOption.run(q4.lastInsertRowid, 'Van Gölü', 1);
        insertOption.run(q4.lastInsertRowid, 'Tuz Gölü', 0);
        insertOption.run(q4.lastInsertRowid, 'Sapanca Gölü', 0);
        insertOption.run(q4.lastInsertRowid, 'Beyşehir Gölü', 0);
        
        // Soru 2
        const q5 = insertQuestion.run(2, 'Osmanlı İmparatorluğu hangi yılda kurulmuştur?');
        insertOption.run(q5.lastInsertRowid, '1299', 1);
        insertOption.run(q5.lastInsertRowid, '1453', 0);
        insertOption.run(q5.lastInsertRowid, '1071', 0);
        insertOption.run(q5.lastInsertRowid, '1326', 0);
        
        // Soru 3
        const q6 = insertQuestion.run(2, '"Kürk Mantolu Madonna" romanının yazarı kimdir?');
        insertOption.run(q6.lastInsertRowid, 'Sabahattin Ali', 1);
        insertOption.run(q6.lastInsertRowid, 'Orhan Pamuk', 0);
        insertOption.run(q6.lastInsertRowid, 'Yaşar Kemal', 0);
        insertOption.run(q6.lastInsertRowid, 'Nazım Hikmet', 0);
        
        // Soru 4
        const q7 = insertQuestion.run(2, 'FIFA Dünya Kupası kaç yılda bir düzenlenir?');
        insertOption.run(q7.lastInsertRowid, '4 yılda bir', 1);
        insertOption.run(q7.lastInsertRowid, '2 yılda bir', 0);
        insertOption.run(q7.lastInsertRowid, '3 yılda bir', 0);
        insertOption.run(q7.lastInsertRowid, '5 yılda bir', 0);
        
        // Soru 5
        const q8 = insertQuestion.run(2, 'Periyodik tabloda hangi elementin sembolü "Au"dur?');
        insertOption.run(q8.lastInsertRowid, 'Altın', 1);
        insertOption.run(q8.lastInsertRowid, 'Gümüş', 0);
        insertOption.run(q8.lastInsertRowid, 'Alüminyum', 0);
        insertOption.run(q8.lastInsertRowid, 'Argon', 0);
        
        // QUIZ 3: TEKNOLOJİ SORULARI
        // Soru 1
        const q9 = insertQuestion.run(3, 'HTML açılımı nedir?');
        insertOption.run(q9.lastInsertRowid, 'HyperText Markup Language', 1);
        insertOption.run(q9.lastInsertRowid, 'High Tech Modern Language', 0);
        insertOption.run(q9.lastInsertRowid, 'Home Tool Markup Language', 0);
        insertOption.run(q9.lastInsertRowid, 'Hyper Transfer Markup Language', 0);
        
        // Soru 2
        const q10 = insertQuestion.run(3, 'Linux işletim sistemi hangi yıl geliştirilmeye başlanmıştır?');
        insertOption.run(q10.lastInsertRowid, '1991', 1);
        insertOption.run(q10.lastInsertRowid, '1985', 0);
        insertOption.run(q10.lastInsertRowid, '1995', 0);
        insertOption.run(q10.lastInsertRowid, '1989', 0);
        
        // Soru 3
        const q11 = insertQuestion.run(3, 'SQL açılımı nedir?');
        insertOption.run(q11.lastInsertRowid, 'Structured Query Language', 1);
        insertOption.run(q11.lastInsertRowid, 'Simple Query Language', 0);
        insertOption.run(q11.lastInsertRowid, 'Standard Query Language', 0);
        insertOption.run(q11.lastInsertRowid, 'System Query Language', 0);
        
        // Soru 4
        const q12 = insertQuestion.run(3, 'ChatGPT hangi şirket tarafından geliştirilmiştir?');
        insertOption.run(q12.lastInsertRowid, 'OpenAI', 1);
        insertOption.run(q12.lastInsertRowid, 'Google', 0);
        insertOption.run(q12.lastInsertRowid, 'Microsoft', 0);
        insertOption.run(q12.lastInsertRowid, 'Meta', 0);
        
        // Soru 5
        const q13 = insertQuestion.run(3, 'WWW (World Wide Web) kim tarafından icat edilmiştir?');
        insertOption.run(q13.lastInsertRowid, 'Tim Berners-Lee', 1);
        insertOption.run(q13.lastInsertRowid, 'Bill Gates', 0);
        insertOption.run(q13.lastInsertRowid, 'Steve Jobs', 0);
        insertOption.run(q13.lastInsertRowid, 'Mark Zuckerberg', 0);
        
        // Soru 6
        const q14 = insertQuestion.run(3, 'İlk iPhone hangi yılda piyasaya sürülmüştür?');
        insertOption.run(q14.lastInsertRowid, '2007', 1);
        insertOption.run(q14.lastInsertRowid, '2005', 0);
        insertOption.run(q14.lastInsertRowid, '2008', 0);
        insertOption.run(q14.lastInsertRowid, '2006', 0);
        
        // Transaction commit
        db.exec("COMMIT;");
        
        console.log("Tüm quizler başarıyla oluşturuldu!");
        console.log("- Limit Türev İntegral Quiz (3 soru)");
        console.log("- Genel Kültür Quiz (5 soru)");
        console.log("- Teknoloji ve Bilişim Quiz (6 soru)");
        
    } catch (error) {
        console.error("Seed işlemi sırasında hata:", error);
        try {
            db.exec("ROLLBACK;");
        } catch (rollbackError) {
            console.error("Rollback hatası:", rollbackError);
        }
    } finally {
        db.close();
    }
}

export default seed;

seed();