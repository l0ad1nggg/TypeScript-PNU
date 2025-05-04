import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { Status } from '../types/Status';
import { TodoContextProps } from '../types/TodoContextProps';
import { auth, db } from '../config/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, addDoc, deleteDoc, doc, updateDoc, where, query, onSnapshot, writeBatch, getDoc, serverTimestamp } from 'firebase/firestore';

export const TodoContext = React.createContext<TodoContextProps>({
  todos: [],
  setTodos: () => {},
  activeTodos: [],
  completedTodos: [],
  filter: Status.ALL,
  addTodo: async () => {},
  toggleCompleted: async () => {},
  toggleAllCompleted: async () => {},
  deleteTodo: async () => {},
  updateTodoTitle: async () => {},
  setFilter: () => {},
  errorMessage: '',
  setErrorMessage: () => {},
  handlerDeleteCompleted: async () => {},
  tempTodo: null,
  setTempTodo: () => {},
  processingIds: [],
  setProcessingIds: () => {},
  inputRef: React.createRef<HTMLInputElement>(),
  user: null,
  updateTodoDate: async () => {},
});

type Props = {
  children: React.ReactNode;
};

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [filter, setFilter] = useState<Status>(Status.ALL);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) {
      setTodos([]);
      return;
    }
  
    const q = query(
      collection(db, 'todos'),
      where('userId', '==', user.uid)
    );
    
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const firebaseTodos = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Todo[];
        setTodos(firebaseTodos);
      },
      (error) => {
        setErrorMessage('Failed to load todos');
        console.error('Firestore error:', error);
      }
    );
  
    return () => unsubscribe();
  }, [user]);

  const updateTodoDate = async (id: string, date: string) => {
    try {
      setProcessingIds(prev => [...prev, id]);
      await updateDoc(doc(db, 'todos', id), { 
        dueDate: date 
      });
    } catch (error) {
      setErrorMessage('Failed to update todo date');
      throw error;
    } finally {
      setProcessingIds(prev => prev.filter(pid => pid !== id));
    }
  };


  const addTodo = async (title: string): Promise<void> => {
    if (!user) {
      setErrorMessage('User not authenticated');
      return;
    }
  
    try {
      setProcessingIds(prev => [...prev, 'temp']);
      setTempTodo({
        id: 'temp',
        title,
        userId: user.uid,
        completed: false
      });
  
      await addDoc(collection(db, 'todos'), {
        title,
        userId: user.uid,
        completed: false,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      setErrorMessage('Failed to add todo');
      throw error;
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== 'temp'));
      setTempTodo(null);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      setProcessingIds(prev => [...prev, id]);
      await deleteDoc(doc(db, 'todos', id));
    } catch (error) {
      setErrorMessage('Failed to delete todo');
    } finally {
      setProcessingIds(prev => prev.filter(pid => pid !== id));
    }
  };

  const toggleCompleted = async (id: string) => {
    try {
      setProcessingIds(prev => [...prev, id]);
      const todoRef = doc(db, 'todos', id);
      const todoDoc = await getDoc(todoRef);
  
      if (!todoDoc.exists()) {
        throw new Error('Todo not found');
      }
  
      await updateDoc(todoRef, {
        completed: !todoDoc.data().completed
      });
    } catch (error) {
      setErrorMessage('Failed to update todo');
    } finally {
      setProcessingIds(prev => prev.filter(pid => pid !== id));
    }
  };

  const toggleAllCompleted = async () => {
    try {
      setProcessingIds(todos.map(t => t.id));
      const targetCompleted = activeTodos.length > 0;
  
      const batch = writeBatch(db);
      todos.forEach(todo => {
        if (todo.completed !== targetCompleted) {
          const todoRef = doc(db, 'todos', todo.id);
          batch.update(todoRef, { completed: targetCompleted });
        }
      });
      
      await batch.commit();
    } catch (error) {
      setErrorMessage('Failed to update todos');
    } finally {
      setProcessingIds([]);
    }
  };

  const updateTodoTitle = async (id: string, newTitle: string) => {
    try {
      setProcessingIds(prev => [...prev, id]);
      await updateDoc(doc(db, 'todos', id), { title: newTitle });
    } catch (error) {
      setErrorMessage('Failed to update todo title');
    } finally {
      setProcessingIds(prev => prev.filter(pid => pid !== id));
    }
  };

  const handlerDeleteCompleted = async () => {
    const completedIds = completedTodos.map(t => t.id);
    const batch = writeBatch(db);

    completedIds.forEach(id => {
      const todoRef = doc(db, 'todos', id);
      batch.delete(todoRef);
    });

    try {
      setProcessingIds(completedIds);
      await batch.commit();
    } catch (error) {
      setErrorMessage('Failed to delete completed todos');
    } finally {
      setProcessingIds(prev => prev.filter(id => !completedIds.includes(id)));
    }
  };

  const valueTodo: TodoContextProps = {
    todos,
    setTodos,
    activeTodos,
    completedTodos,
    filter,
    addTodo,
    deleteTodo,
    toggleCompleted,
    toggleAllCompleted,
    updateTodoTitle: async (id: string, newTitle: string) => updateTodoTitle(id, newTitle),
    setFilter,
    errorMessage,
    setErrorMessage,
    handlerDeleteCompleted,
    tempTodo,
    setTempTodo,
    processingIds,
    setProcessingIds,
    inputRef,
    user,
    updateTodoDate,
  };

  return (
    <TodoContext.Provider value={valueTodo}>
      {children}
    </TodoContext.Provider>
  );
};