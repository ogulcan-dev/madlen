import { Router } from "express";
import Database from "better-sqlite3";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();
let db;

db = new Database(path.join(__dirname, "..", "database", "database.db"));

// 1. /quizzes - Tüm quizleri veritabanından al (id ve tittle değerine göre)
router.get("/quizzes" , (req, res) => {
    try {
         const quizzes = db.prepare("SELECT id, title FROM quizs").all();
         res.status(200).json({
            status: 200,
            data: quizzes
         });
    } catch (err) {
        res.status(500).json({
            status: 500,
            error: "Sunucu hatası: " + err.message
        });
    }
})

// 2. /quizzes/:id - Belirli bir Quizin bilgilerini veritabanından al (id ve tittle değerine göre)
router.get("/quizzes/:id" , (req, res) => {
    try {
        //İstekten parametlerinden ID verisini al
        const { id } = req.params;

        //Veritabanında quizin olup olmadığını kontrol et
        const quiz = db.prepare("SELECT id, title FROM quizs WHERE id = ?").get(id);
        if(!quiz) return res.status(404).json({
            status: 404,
            error: "Quiz veritabanında bulunamadı."
        })

        //Quiz sorularını veritabanından çek
        const questions = db.prepare(`
            SELECT q.id, q.question_text as questionText
            FROM quiz_questions q
            WHERE q.quiz_id = ?
            ORDER BY q.id`
        ).all(id)

        //Quiz cevaplarını veritabanından çek
        const questionsWithOptions = questions.map(question => {
            const options = db.prepare(`
                SELECT id, option_text as text
                FROM quiz_sections
                WHERE quiz_question_id = ?
                ORDER BY id
                `).all(question.id)

                return {id: question.id, questionText: question.questionText, options: options}
        })
        res.status(200).json({
            status: 200,
            data: {
                id: quiz.id,
                title: quiz.title,
                questions: questionsWithOptions
            }
        })
    } catch (err) {
        res.status(500).json({
            status: 500,
            error: "Sunucu hatası: " + err.message
        });
    }
})

// 3. /quizzes/:id/submit - Quiz sorularını veritabanına gönder ve puan hesapla
router.post("/quizzes/:id/submit" , (req, res) => {
    try {
        //İstek parametlerinden Quiz Idsini çek
        const { id } = req.params;
    
        //İstek bodysinden questionId ve answerIndex değerlerini çek
        const {questionId, answerIndex} = req.body;

        if(!Array.isArray(questionId) || !Array.isArray(answerIndex)) {
            return res.status(400).json({
                status: 400,
                error: "questionId ve answerIndex değerleri array olmalı"
            })
        }

        if(questionId.length !== answerIndex.length) {
            return res.status(400).json({
                status: 400,
                error: "questionId ve answerIndex değerleri aynı uzunlukte olmalı"
            })
        }

        let score = 0;
        let total = questionId.length;

        //Quizin veritabanında olup olmadığını kontrol et
        const quiz = db.prepare("SELECT id, title FROM quizs WHERE id = ?").get(id);
        if(!quiz) return res.status(404).json({
            status: 404,
            error: "Veritabanında quiz bulunamadı."
        })

        //Quizin soruları olup olmadığını kontrol et
        const questions = db.prepare("SELECT id FROM quiz_questions WHERE quiz_id = ?").all(id);
        if(questions.length === 0) return res.status(404).json({
            status: 404,
            error: "Veritabanında quize ait soru bulunamadı."
        })    
                
        // Her bir soru-cevap çifti için kontrol edin
        for(let i = 0; i < questionId.length; i++) {
            const questionID = questionId[i];
            const answerIndexx = answerIndex[i];


            //Soru cevaplarını veritabanından al
            const options = db.prepare(`
                SELECT id, is_correct
                FROM quiz_sections
                WHERE quiz_question_id = ?
                ORDER BY id
                `).all(questionID)

          // İndekse göre seçilen seçeneği kontrol et
          if(answerIndexx >= 0 && answerIndexx < options.length) {
            const selectedOption = options[answerIndexx];

            //Cevabı veritabanına kaydet
            db.prepare(`
                INSERT INTO quiz_answers (quiz_id, quiz_question_id, selected_option_id)
                VALUES (?, ?, ?)
                `).run(id, questionID, selectedOption.id)

                //Cevabı kontrol et, doğruysa bir puan arttır.
                if(selectedOption.is_correct) score++;
                
          }
        }


        //Sonucu veritabanına kaydet. //Score front endde devre dışı, ileride güncellemeler için eklendi.
        db.prepare(`
            INSERT INTO quiz_results (quiz_id, score)
            VALUES (?, ?)
            `).run(id, score)

        res.status(200).json({
            status: 200,
            data: {
                score: score,
                total: total,
            }
        })
 

     } catch (err) {
        res.status(500).json({
            status: 500,
            error: "Internal server error: " + err.message
        });
     }
})

export default router;