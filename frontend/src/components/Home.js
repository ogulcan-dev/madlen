import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Quizler yükleniyor...');
    fetchQuizzes();
  }, []);
  
  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/quizzes');
      
      if (response.ok) {
        const data = await response.json();
        setQuizzes(data.data || []);
        setError(null);
      } else {
        console.error('API hatası:', response.status);
        setError('Bir hata oluştu');
      }
    } catch (err) {
      console.error('Hata:', err);
      setError('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };


  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', padding: '20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Başlık */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            color: '#333',
            marginBottom: '10px' 
          }}>
            🧠 Quizler
          </h1>
          <p style={{ color: '#666', fontSize: '16px' }}>
            Bilginizi test edin ve öğrenmeye devam edin!
          </p>
        </div>

        {/* Yenile butonu */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <button 
            onClick={() => {
              window.location.reload();
            }}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🔄 Yenile
          </button>
        </div>

        {/* Loading durumu */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #007bff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            <p style={{ color: '#666' }}>Quizler yükleniyor...</p>
          </div>
        )}

        {/* Hata durumu */}
        {error && !loading && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{
              backgroundColor: '#f8d7da',
              color: '#721c24',
              padding: '15px',
              borderRadius: '5px',
              border: '1px solid #f5c6cb',
              marginBottom: '20px'
            }}>
              <strong>Hata!</strong> {error}
            </div>
            <button 
              onClick={() => {
                window.location.reload();
              }}
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Tekrar Dene
            </button>
          </div>
        )}

        {/* Quiz listesi */}
        {!loading && !error && (
          <div>
            <h2 style={{ 
              fontSize: '24px', 
              marginBottom: '20px', 
              color: '#333' 
            }}>
              📚 Mevcut Quizler ({quizzes.length})
            </h2>
            
            {quizzes.length === 0 ? (
              <div style={{
                backgroundColor: '#fff3cd',
                color: '#856404',
                padding: '20px',
                borderRadius: '5px',
                border: '1px solid #ffeaa7',
                textAlign: 'center'
              }}>
                <p><strong>Henüz quiz bulunamadı.</strong></p>
                <p>Lütfen daha sonra tekrar deneyin.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {quizzes.map((quiz, index) => (
                  <div key={quiz.id} style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: '1px solid #dee2e6'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ 
                          fontSize: '18px', 
                          fontWeight: '600', 
                          color: '#333',
                          marginBottom: '5px'
                        }}>
                          {quiz.title}
                        </h3>
                        <p style={{ 
                          color: '#666', 
                          fontSize: '14px',
                          margin: '0'
                        }}>
                          Quiz #{quiz.id} • Tıklayarak başlatın
                        </p>
                      </div>
                      <Link 
                        to={`/quiz/${quiz.id}`}
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
                        Başlat →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home; 