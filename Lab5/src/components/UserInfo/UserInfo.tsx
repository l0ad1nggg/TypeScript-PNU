import React, { useContext, useState } from 'react';
import { TodoContext } from '../TodosContext';
import { auth } from '../../config/firebase';
import './UserInfo.scss';
import { Header } from '../Header/Header';

export const UserInfo: React.FC = () => {
  const { todos } = useContext(TodoContext);
  const user = auth.currentUser;
  const [showProfile, setShowProfile] = useState(false);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  const handleProfileClick = () => {
    setShowProfile(!showProfile);
  };

  const handleLogout = async () => {
    await auth.signOut();
    setShowProfile(false);
  };

  return (
    <header className="user-header">
      <Header />
      {user && (
        <div className="user-profile">
          <div 
            className="user-avatar" 
            onClick={handleProfileClick}
            role="button"
            tabIndex={0}
          >
            <img 
              src={user.photoURL || '/default-avatar.png'} 
              alt="User avatar" 
              className="avatar-image"
            />
          </div>
          
          {showProfile && (
            <div className="profile-dropdown">
              <div className="dropdown-header">
                <h3 className="user-name">{user.displayName || 'User'}</h3>
                <p className="user-email">{user.email}</p>
              </div>
              
              <div className="dropdown-stats">
                <div className="stat-item">
                  <span className="stat-label">Active tasks:</span>
                  <span className="stat-value">{activeTodosCount}</span>
                </div>
              </div>
              
              <button 
                className="logout-button"
                onClick={handleLogout}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};