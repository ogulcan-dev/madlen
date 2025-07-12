import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';

function Result() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const calculateResults = useCallback(async () => {
    try {
      setIsLoading(true);
      setHasError(false);

      const quizResponse = await fetch(`http://localhost:3001/quizzes/${id}`);
      
      if (!quizResponse.ok) {
        throw new Error('Quiz verileri alınamadı!');
      }
      
      await quizResponse.json();
      const questionIdParam = searchParams.get('questionId');
      const answerIndexParam = searchParams.get('answerIndex');
      
      if (!questionIdParam || !answerIndexParam) {
        throw new Error('Cevap verileri bulunamadı!');
      }

      let questionIds = JSON.parse(decodeURIComponent(questionIdParam));
      let answerIndexes = JSON.parse(decodeURIComponent(answerIndexParam));

      const resultResponse = await fetch(`http://localhost:3001/quizzes/${id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          questionId: questionIds,
          answerIndex: answerIndexes
        })
      });

      if (!resultResponse.ok) {
        throw new Error('Sonuçlar hesaplanamadı!');
      }

      const resultData = await resultResponse.json();
      setResult(resultData.data);
      setIsLoading(false);

    } catch (error) {
      console.error('Result calculation error:', error);
      setHasError(true);
      setErrorMsg(error.message);
      setIsLoading(false);
    }
  }, [id, searchParams]);

  useEffect(() => {
    calculateResults();
  }, [calculateResults]);

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
          <p style={{ color: '#666' }}>Sonuçlar hesaplanıyor...</p>
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
          textAlign: 'center',
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#dc3545', marginBottom: '20px' }}>❌ Hata!</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>Hata: {errorMsg}</p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button 
              onClick={calculateResults} 
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Tekrar Dene
            </button>
            <Link 
              to="/"
              style={{
                backgroundColor: '#6c757d',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '5px',
                textDecoration: 'none',
                display: 'inline-block'
              }}
            >
              Ana Sayfa
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalQuestions = result?.total || 0;
  const correctAnswers = result?.score || 0;

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
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '500px'
      }}>
        
        <h1 style={{ marginBottom: '30px', color: '#333' }}>🎉 Quiz Tamamlandı!</h1>
        
        <div style={{
          backgroundColor: '#e7f3ff',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '30px'
        }}>
          <p style={{ 
            fontSize: '28px', 
            marginBottom: '10px', 
            color: '#007bff',
            fontWeight: 'bold'
          }}>
            {correctAnswers} / {totalQuestions}
          </p>
          <p style={{
            fontSize: '16px',
            color: '#666',
            margin: '0'
          }}>
            {totalQuestions} sorudan {correctAnswers} tanesini doğru yaptınız!
          </p>
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Link 
            to={`/quiz/${id}`}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '5px',
              textDecoration: 'none',
              fontWeight: '500',
              display: 'inline-block'
            }}
          >
            🔄 Tekrar Çöz
          </Link>
          
          <Link 
            to="/"
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '5px',
              textDecoration: 'none',
              fontWeight: '500',
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

export default Result; 