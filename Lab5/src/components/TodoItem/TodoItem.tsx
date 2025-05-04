import { useContext, useEffect, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoContext } from '../TodosContext';
import { updateTodo } from '../../api/todos';
import { format, parseISO } from 'date-fns';
import './TodoItem.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';

interface Props {
  todo: Todo;
}

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    toggleCompleted,
    deleteTodo,
    processingIds,
    setErrorMessage,
    setProcessingIds,
    inputRef,
    updateTodoDate,
  } = useContext(TodoContext);
  const [isEditing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(todo.dueDate || '');

  const handleDateChange = async (date: string) => {
    try {
      setProcessingIds((prev) => [...prev, todo.id]);
      await updateTodoDate(todo.id, date);
      setDatePickerOpen(false);
    } catch (error) {
      setErrorMessage('Failed to update date');
    } finally {
      setProcessingIds((prev) => prev.filter(id => id !== todo.id));
    }
  };

  const getDateStatus = () => {
    if (!todo.dueDate) return '';
    const dueDate = parseISO(todo.dueDate.toString());
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (dueDate < today) return 'overdue';
    if (dueDate.getDate() === today.getDate()) return 'today';
    return 'upcoming';
  };

  const dateStatus = getDateStatus();

  const handleToggleTodo = () => toggleCompleted(todo.id);
  const handleDeleteTodo = () => deleteTodo(todo.id);
  const handleEditingTodo = () => {
    setEditing(true);
    setTitle(todo.title.trim());
  };

  const renameTodo = async (todoToUpdate: Todo, newTitle: string) => {
    setErrorMessage('');
    setProcessingIds((current) => [...current, todoToUpdate.id]);
    try {
      await updateTodo({ ...todoToUpdate, title: newTitle });
      setEditing(false);
    } catch {
      setErrorMessage('Unable to update a todo');
      inputRef.current?.focus();
    } finally {
      setProcessingIds((current) => current.filter((id) => id !== todoToUpdate.id));
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (trimmedTitle === todo.title.trim()) {
      setEditing(false);
      return;
    }
    if (trimmedTitle === '') {
      handleDeleteTodo();
      return;
    }
    renameTodo(todo, trimmedTitle);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) inputRef.current.focus();
  }, [isEditing, inputRef]);

  return (
    <div className={classNames('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleToggleTodo}
        />
      </label>
      <div className="todo__calendar-section">
        <button
          className={classNames('calendar-button', dateStatus)}
          onClick={() => setDatePickerOpen(!isDatePickerOpen)}
        >
          <span className="material-icons"><FontAwesomeIcon icon={faCalendarDays} /></span>
          {todo.dueDate && (
            <span className="due-date">
              {format(parseISO(todo.dueDate.toString()), 'd MMM')}
            </span>
          )}
        </button>

        {isDatePickerOpen && (
          <div className="date-picker-popup">
            <input
              type="date"
              value={typeof selectedDate === 'string' ? selectedDate : format(selectedDate, 'yyyy-MM-dd')}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={format(new Date(), 'yyyy-MM-dd')}
              className="date-input"
            />
            <div className="date-picker-actions">
              <button 
                className="date-cancel"
                onClick={() => setDatePickerOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="date-apply"
                onClick={() => handleDateChange(selectedDate.toString())}
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>
      
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onBlur={handleSubmit}
            ref={inputRef}
            onKeyUp={(event) => {
              if (event.key === 'Escape') {
                setEditing(false);
                setTitle(todo.title);
              }
            }}
          />
        </form>
      ) : (
        <>
          <span className="todo__title" onDoubleClick={handleEditingTodo}>
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDeleteTodo}
          >
            ×
          </button>
        </>
      )}
      <div className={classNames('modal overlay', { 'is-active': processingIds.includes(todo.id) })}>
        <div className="modal-background" />
        <div className="loader" />
      </div>
    </div>
  );
};