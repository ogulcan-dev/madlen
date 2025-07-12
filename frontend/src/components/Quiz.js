import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadQuiz = useCallback(async () => {
    try {
      console.log('Quiz yükleniyor...');
      setIsLoading(true);
      setHasError(false);
      
      const url = `http://localhost:3001/quizzes/${id}`;
      console.log('API URL:', url);
      
      const response = await fetch(url);
      console.log('Cevap sonucu:', response.status);
      
      if (!response.ok) {
        throw new Error('Quiz bulunamadı!');
      }
      
      const data = await response.json();
      console.log('Quiz verileri:', data);
      
      setQuiz(data.data);
      setQuestions(data.data.questions || []);
      setIsLoading(false);
      
    } catch (error) {
      console.error('Quiz yükleme hatası:', error);
      setHasError(true);
      setErrorMessage(error.message);
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    console.log('Quiz ID:', id);
    loadQuiz();
  }, [id, loadQuiz]);

  function selectAnswer(optionIndex) {
    console.log('Seçilen cevap:', optionIndex);
    const questionId = questions[currentQuestion].id;
    console.log('Soru ID:', questionId);
    
    const newAnswers = { ...answers };
    newAnswers[questionId] = optionIndex;
    setAnswers(newAnswers);
    
    console.log('Güncel cevaplar:', newAnswers);
  }

  function goToNext() {
    console.log('Sonraki soruya geçiliyor...');
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      console.log('Yeni soru numarası:', currentQuestion + 1);
    } else {
      console.log('Quiz bitiriliyor...');
      finishQuiz();
    }
  }

  function goToPrevious() {
    console.log('Önceki soruya dönülüyor...');
    
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      console.log('Yeni soru numarası:', currentQuestion - 1);
    }
  }

  function finishQuiz() {
    console.log('Quiz bitiriliyor...');
    console.log('Final cevaplar:', answers);
    
    const questionIds = [];
    const answerIndexes = [];
    
    for (let question of questions) {
      if (answers[question.id] !== undefined) {
        questionIds.push(question.id);
        answerIndexes.push(answers[question.id]);
      }
    }
    
    console.log('Soru IDleri:', questionIds);
    console.log('Cevap indeksleri:', answerIndexes);
    
    const questionParam = encodeURIComponent(JSON.stringify(questionIds));
    const answerParam = encodeURIComponent(JSON.stringify(answerIndexes));
    const resultUrl = `/quiz/${id}/result?questionId=${questionParam}&answerIndex=${answerParam}`;
    
    console.log('Sonuç URL:', resultUrl);
    navigate(resultUrl);
  }

  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f8f9fa', 
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '5px solid #f3f3f3',
            borderTop: '5px solid #007bff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <h2 style={{ color: '#333' }}>Quiz Yükleniyor...</h2>
          <p style={{ color: '#666' }}>Lütfen bekleyin</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f8f9fa', 
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ 
          maxWidth: '500px', 
          textAlign: 'center',
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ color: '#dc3545', marginBottom: '20px' }}>❌ Hata!</h1>
          <p style={{ color: '#666', marginBottom: '30px', fontSize: '16px' }}>
            {errorMessage}
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button 
              onClick={loadQuiz}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              🔄 Tekrar Dene
            </button>
            <Link 
              to="/"
              style={{
                backgroundColor: '#6c757d',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '5px',
                textDecoration: 'none',
                fontSize: '14px',
                display: 'inline-block'
              }}
            >
              🏠 Ana Sayfa
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz || !questions || questions.length === 0) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f8f9fa', 
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#ffc107' }}>⚠️ Bu quiz için soru bulunamadı</h2>
          <Link 
            to="/"
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '5px',
              textDecoration: 'none',
              display: 'inline-block',
              marginTop: '20px'
            }}
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const selectedAnswer = answers[question.id];
  const totalAnswered = Object.keys(answers).length;
  const progressPercent = Math.round(((currentQuestion + 1) / questions.length) * 100);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', padding: '20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Üst bar */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <Link 
              to="/" 
              style={{
                color: '#007bff',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              ← Ana Sayfa
            </Link>
            <div style={{ color: '#666', fontSize: '14px' }}>
              Soru {currentQuestion + 1} / {questions.length}
            </div>
          </div>
          
          <h1 style={{ 
            fontSize: '24px', 
            color: '#333', 
            marginBottom: '15px',
            margin: '0 0 15px 0'
          }}>
            📝 {quiz.title}
          </h1>
          
          {/* İlerleme çubuğu */}
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#e9ecef',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progressPercent}%`,
              height: '100%',
              backgroundColor: '#28a745',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
          <p style={{ 
            fontSize: '12px', 
            color: '#666', 
            margin: '5px 0 0 0',
            textAlign: 'center'
          }}>
            {progressPercent}% Tamamlandı
          </p>
        </div>

        {/* Soru kartı */}
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '10px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ 
            fontSize: '20px', 
            color: '#333', 
            marginBottom: '25px',
            lineHeight: '1.5'
          }}>
            {question.questionText}
          </h2>

          {/* Seçenekler */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {question.options && question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              return (
                <button
                  key={option.id}
                  onClick={() => selectAnswer(index)}
                  style={{
                    width: '100%',
                    padding: '16px',
                    textAlign: 'left',
                    border: isSelected ? '2px solid #007bff' : '2px solid #dee2e6',
                    borderRadius: '8px',
                    backgroundColor: isSelected ? '#e7f3ff' : 'white',
                    color: isSelected ? '#007bff' : '#333',
                    cursor: 'pointer',
                    fontSize: '16px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    if (!isSelected) {
                      e.target.style.borderColor = '#adb5bd';
                      e.target.style.backgroundColor = '#f8f9fa';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isSelected) {
                      e.target.style.borderColor = '#dee2e6';
                      e.target.style.backgroundColor = 'white';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: isSelected ? '6px solid #007bff' : '2px solid #adb5bd',
                      marginRight: '12px',
                      backgroundColor: isSelected ? '#007bff' : 'transparent'
                    }}></div>
                    <span>{option.text}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigasyon */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 2fr 1fr', 
            gap: '20px', 
            alignItems: 'center' 
          }}>
            
            {/* Sol - Önceki butonu */}
            <div>
              <button
                onClick={goToPrevious}
                disabled={currentQuestion === 0}
                style={{
                  padding: '12px 20px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: currentQuestion === 0 ? '#e9ecef' : '#6c757d',
                  color: currentQuestion === 0 ? '#adb5bd' : 'white',
                  cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                ← Önceki
              </button>
            </div>

            {/* Orta - Bilgi */}
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                {totalAnswered} / {questions.length} soru cevaplanmış
              </p>
              {selectedAnswer === undefined && (
                <p style={{ 
                  margin: '5px 0 0 0', 
                  color: '#ffc107', 
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  ⚠️ Devam etmek için bir seçenek işaretleyin
                </p>
              )}
            </div>

            {/* Sağ - Sonraki butonu */}
            <div style={{ textAlign: 'right' }}>
              <button
                onClick={goToNext}
                disabled={selectedAnswer === undefined}
                style={{
                  padding: '12px 20px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: selectedAnswer === undefined 
                    ? '#e9ecef' 
                    : currentQuestion === questions.length - 1 
                      ? '#28a745' 
                      : '#007bff',
                  color: selectedAnswer === undefined ? '#adb5bd' : 'white',
                  cursor: selectedAnswer === undefined ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                {currentQuestion === questions.length - 1 ? '✅ Quizi Bitir' : 'Sonraki →'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Quiz; 