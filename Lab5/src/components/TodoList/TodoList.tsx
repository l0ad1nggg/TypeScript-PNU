import { useContext } from 'react';
import { TodoContext } from '../TodosContext';
import { TodoItem } from '../TodoItem/TodoItem';
import { filterTodos } from '../../utils/getFilteredTodos';
import './TodoList.scss';

export const TodoList: React.FC = () => {
  const { todos, filter, tempTodo, errorMessage } = useContext(TodoContext);
  const filteredTodos = filterTodos(todos, filter);

  return (
    <ul className="todo-list">
      {filteredTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
      {!!tempTodo && !errorMessage && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input data-cy="TodoStatus" type="checkbox" className="todo__status" />
          </label>
          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>
          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>
          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background" />
            <div className="loader" />
          </div>
        </div>
      )}
    </ul>
  );
};