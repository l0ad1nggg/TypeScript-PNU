import { SetStateAction } from 'react';
import { Status } from './Status';
import { Todo } from './Todo';
import { User } from 'firebase/auth';

export interface TodoContextProps {
  todos: Todo[];
  setTodos: React.Dispatch<SetStateAction<Todo[]>>;
  activeTodos: Todo[];
  completedTodos: Todo[];
  filter: Status;
  addTodo: (title: string) => Promise<void>;
  toggleCompleted: (id: string) => Promise<void>; 
  toggleAllCompleted: () => Promise<void>; 
  deleteTodo: (id: string) => Promise<void>; 
  setFilter: (filter: Status) => void;
  errorMessage: string;
  setErrorMessage: React.Dispatch<SetStateAction<string>>;
  handlerDeleteCompleted: () => Promise<void>; 
  tempTodo: null | Todo;
  setTempTodo: React.Dispatch<SetStateAction<null | Todo>>;
  processingIds: string[]; 
  setProcessingIds: React.Dispatch<SetStateAction<string[]>>; 
  updateTodoTitle: (id: string, newTitle: string) => Promise<void>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  user: User | null;
  updateTodoDate: (id: string, date: string) => Promise<void>;
}