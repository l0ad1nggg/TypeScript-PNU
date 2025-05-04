import { GoogleAuth } from '../GoogleAuth/GoogleAuth';
import './AuthPage.scss';

export const AuthPage = () => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Welcome to Task Manager</h1>
        <p className="auth-subtitle">Organize your life with our simple task manager</p>
        <div className="auth-features">
          <div className="feature-item">
            <span className="feature-icon">✅</span>
            <h3>Smart Organization</h3>
            <p>Easily manage tasks with due dates and priorities</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📅</span>
            <h3>Calendar Sync</h3>
            <p>Integrate with Google Calendar</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🔒</span>
            <h3>Secure</h3>
            <p>Your data is protected</p>
          </div>
        </div>
        <div className="auth-cta">
          <p className="cta-text">Get started in seconds</p>
          <GoogleAuth />
        </div>
      </div>
    </div>
  );
};