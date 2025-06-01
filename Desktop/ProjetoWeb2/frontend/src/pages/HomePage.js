// frontend/src/pages/HomePage.js
import React from 'react';
import QuizInterface from '../components/QuizInterface'; // Vamos criar este componente a seguir
import './HomePage.css'; // Opcional: crie este arquivo para estilos específicos da página

function HomePage() {
  return (
    <div className="home-page">
      <header className="home-page-header">
        <h1>Bem-vindo ao Quiz Interativo!</h1>
      </header>
      <main className="home-page-main">
        <QuizInterface />
      </main>
      <footer className="home-page-footer">
        <p>&copy; {new Date().getFullYear()} Meu Projeto Educacional</p>
      </footer>
    </div>
  );
}

export default HomePage;