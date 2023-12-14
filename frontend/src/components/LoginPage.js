import React from 'react';
import '../styles/LoginPage.css';

function LoginPage() {
  return (
    <div className="login-container">
      <h1>Workout Planner</h1>
      <form>
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Log In</button>
        <p>New User? <a href="/register">Sign Up</a></p>
        {/* Google Sign-In will be added here */}
      </form>
    </div>
  );
}

export default LoginPage;
