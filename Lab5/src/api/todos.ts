// api/todos.ts
import { 
  collection, 
  addDoc,  
  query, 
  where, 
  updateDoc, 
  doc, 
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Todo } from '../types/Todo';

export const getTodos = (userId: string, callback: (todos: Todo[]) => void) => {
  const q = query(collection(db, 'todos'), where('userId', '==', userId));
  return onSnapshot(q, (querySnapshot) => {
    const todos = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }) as Todo);
    callback(todos);
  });
};

export const addTodo = async (todo: Omit<Todo, 'id'>) => {
  if (!todo.userId || !todo.title || typeof todo.completed !== 'boolean') {
    throw new Error('Missing or invalid required fields: userId, title, or completed');
  }
  const docRef = await addDoc(collection(db, 'todos'), todo);
  return { id: docRef.id, ...todo };
};

export const deleteTodoAPI = async (id: string) => {
  await deleteDoc(doc(db, 'todos', id));
};
export const updateTodo = async (todo: Todo) => {
  const { id, ...data } = todo;
  // Remove undefined fields to prevent Firestore errors
  const filteredData = Object.fromEntries(
    Object.entries(data).filter(([_, value]) => value !== undefined)
  );
  await updateDoc(doc(db, 'todos', id), filteredData);
};