import { useContext } from 'react';
import { TodoContext } from '../TodosContext';
import './ErrorMessage.scss';

export const ErrorComponent: React.FC = () => {
  const { errorMessage } = useContext(TodoContext);
  return errorMessage ? <div className="error">{errorMessage}</div> : null;
};