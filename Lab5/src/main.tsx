import { createRoot } from 'react-dom/client';
import './styles/global.scss';
import { App } from './App';
import { TodoProvider } from './components/TodosContext';

createRoot(document.getElementById('root') as HTMLDivElement).render(
  <TodoProvider>
    <App />
  </TodoProvider>
);