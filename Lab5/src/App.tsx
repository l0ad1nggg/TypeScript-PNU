import React, { useContext, useEffect, useState } from 'react';
import { TodoContext } from './components/TodosContext';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorComponent } from './components/ErrorMessage/ErrorComponent';
import { AuthPage } from './components/AuthPage/AuthPage';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './config/firebase';
import './App.scss';
import { UserInfo } from './components/UserInfo/UserInfo';

export const App: React.FC = () => {
  const { todos } = useContext(TodoContext);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Додаємо стан завантаження

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); 
    });
    return () => unsubscribe();
  }, []);

  // Показуємо порожній екран або лоадер, поки перевіряється авторизація
  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  // Якщо користувач не авторизований, показуємо AuthPage
  if (!user) {
    return <AuthPage />;
  }

  // Якщо користувач авторизований, показуємо основний додаток
  return (
    <div className="todoapp">
     
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <UserInfo />
        {todos && <TodoList />}
        {todos.length > 0 && <Footer />}
        <ErrorComponent />
      </div>
    </div>
  );
};