import { useContext } from 'react';
import classNames from 'classnames';
import './TodoFilter.scss';

import { Status } from '../../types/Status';
import { TodoContext } from '../TodosContext';
import { TodoContextProps } from '../../types/TodoContextProps';

interface PropsFilter {
  filter: Status;
  setFilter: (filter: Status) => void;
}

export const TodosFilter: React.FC<PropsFilter> = () => {
  const todoContext = useContext<TodoContextProps>(TodoContext);

  const filter = todoContext?.filter;
  const setFilter = todoContext?.setFilter;

  return (
    <nav className="filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: filter === Status.ALL,
        })}
        onClick={() => setFilter(Status.ALL)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filter === Status.ACTIVE,
        })}
        onClick={() => setFilter(Status.ACTIVE)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filter === Status.COMPLETED,
        })}
        onClick={() => setFilter(Status.COMPLETED)}
      >
        Completed
      </a>
    </nav>
  );
};