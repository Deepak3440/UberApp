import React from 'react';

const ErrorPage = () => {
  const handleBackToHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="error-container">
      <div className="error-icon">&#9888;</div>
      <h1>Oops! Something went wrong.</h1>
      <p>We couldn't complete your request. Please try again later or go back to the home page.</p>
      <button onClick={handleBackToHome}>Back to Home</button>
      <style>
        {`.error-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
  padding: 20px;
  background-color: #f5f5f5;
}

.error-icon {
  font-size: 4rem;
  color: #ff0000;
  margin-bottom: 20px;
}

h1 {
  font-size: 2rem;
  margin-bottom: 10px;
}

p {
  font-size: 1rem;
  margin-bottom: 20px;
}

button {
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}`}
      </style>
    </div>
    
  );
};

export default ErrorPage;
