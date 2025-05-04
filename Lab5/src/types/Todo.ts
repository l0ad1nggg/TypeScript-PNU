export interface Todo {
  id: string; 
  userId: string;
  title: string;
  completed: boolean;
  createdAt?: Date; // для Firebase timestamp
  dueDate?: Date; // для інтеграції з календарем
}