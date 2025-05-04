import React, { useContext, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { TodoContext } from '../TodosContext';
import './Header.scss';

export const Header: React.FC = () => {
  const {
    todos,
    activeTodos,
    addTodo,
    toggleAllCompleted,
    setErrorMessage,
    setTempTodo,
    user,
  } = useContext(TodoContext);
  const [titleNewTodo, setTitleNewTodo] = useState('');
  const [disabledInput, setDisabledInput] = useState(false);
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) titleField.current.focus();
  }, [todos.length, disabledInput]);

  const handleAllToggle = () => toggleAllCompleted();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = titleNewTodo.trim();
    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');
      return;
    }
    if (!user) {
      setErrorMessage('User not authenticated');
      return;
    }
    try {
      setDisabledInput(true);
      setTempTodo({ id: 'temp', title: trimmedTitle, userId: user.uid, completed: false });
      await addTodo(trimmedTitle);
      setTitleNewTodo('');
    } catch {
      setErrorMessage('Unable to add a todo');
    } finally {
      setDisabledInput(false);
      setTempTodo(null);
    }
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', { active: activeTodos.length === 0 })}
          data-cy="ToggleAllButton"
          onClick={handleAllToggle}
        />
      )}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={titleNewTodo}
          onChange={(event) => setTitleNewTodo(event.target.value)}
          disabled={disabledInput}
          ref={titleField}
        />
      </form>
    </header>
  );
};