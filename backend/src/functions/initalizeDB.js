import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const runSeed = async () => {
    try {
        const { default: seedModule } = await import("../seed.js");
    } catch (error) {
        console.error("Seed import hatası:", error);
    }
};

const initializeDB = () => {
    const dbPath = path.join(__dirname, "..", "database", "database.db");
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
    }
    
    const db = new Database(dbPath);
    
    db.exec(`PRAGMA foreign_keys = OFF;`);
        
    db.exec(`
        CREATE TABLE IF NOT EXISTS quizs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS quiz_questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            quiz_id INTEGER NOT NULL,
            question_text TEXT NOT NULL,
            FOREIGN KEY (quiz_id) REFERENCES quizs(id)
        );
        CREATE TABLE IF NOT EXISTS quiz_sections (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            quiz_question_id INTEGER NOT NULL,
            option_text TEXT NOT NULL,
            is_correct BOOLEAN NOT NULL,
            FOREIGN KEY (quiz_question_id) REFERENCES quiz_questions(id)
        );
        CREATE TABLE IF NOT EXISTS quiz_answers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            quiz_id INTEGER NOT NULL,
            quiz_question_id INTEGER NOT NULL,
            selected_option_id INTEGER NOT NULL,
            FOREIGN KEY (quiz_id) REFERENCES quizs(id),
            FOREIGN KEY (quiz_question_id) REFERENCES quiz_questions(id),
            FOREIGN KEY (selected_option_id) REFERENCES quiz_sections(id)
        );
        CREATE TABLE IF NOT EXISTS quiz_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            quiz_id INTEGER NOT NULL,
            score INTEGER NOT NULL,
            FOREIGN KEY (quiz_id) REFERENCES quizs(id)
        );
    `);
    
    db.exec(`PRAGMA foreign_keys = ON;`);
    console.log("Gerekli tablolar oluşturuldu.");
    db.close();
    
    // Seed işlemini çalıştır
    console.log("Seed işlemi başlatılıyor...");
    runSeed();
}

export default initializeDB;