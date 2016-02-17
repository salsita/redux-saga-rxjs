import * as Actions from '../constants/actions';

const initialAppState = {
  text: '',
  todos: [],
  apiInProgress: false,
  commands: {
    undo: [],
    redo: []
  }
};

export default (appState = initialAppState, { type, payload }) => {

  switch (type) {
    case Actions.CHANGE_TEXT:
      return { ...appState, text: payload };

    case Actions.ADD_TODO_ID:
      return {
        ...appState,
        apiInProgress: true,
        todos: [...appState.todos, { id: payload.clientId, title: payload.title, transient: true }]
      };

    case Actions.TODO_ADDED:
      return {
        ...appState,
        text: '',
        apiInProgress: false,
        todos: appState.todos.map(todo => {
          if (todo.id === payload.clientId) {
            return { ...todo, id: payload.serverId, transient: false };
          } else {
            return todo;
          }
        }),
        commands: {
          ...appState.commands,
          undo: [...appState.commands.undo, payload]
        }
      };

    case Actions.ADD_TODO_FAILED:
      return {
        ...appState,
        apiInProgress: false,
        todos: appState.todos.filter(todo => todo.id !== payload)
      };


    case Actions.REDONE:
      const redo = [...appState.commands.redo];
      redo.shift();

      return {
        ...appState,
        commands: {
          ...appState.commands,
          redo: redo
        }
      };

    case Actions.CLEAR_REDO_LOG:
      return {
        ...appState,
        commands: {
          ...appState.commands,
          redo: []
        }
      };

    case Actions.UNDO:
      return {
        ...appState,
        apiInProgress: true,
        todos: appState.todos.map(todo => {
          if (todo.id === payload.serverId) {
            return { ...todo, transient: true };
          } else {
            return todo;
          }
        })
      };

    case Actions.UNDO_FAILED:
      return {
        ...appState,
        apiInProgress: false,
        todos: appState.todos.map(todo => {
          if (todo.id === payload) {
            return { ...todo, transient: false };
          } else {
            return todo;
          }
        })
      };

    case Actions.UNDONE:
      const undo = [...appState.commands.undo];
      undo.pop();

      return {
        ...appState,
        apiInProgress: false,
        todos: appState.todos.filter(todo => todo.id !== payload.serverId),
        commands: {
          ...appState.commands,
          undo,
          redo: [payload.command, ...appState.commands.redo]
        }
      };

    default:
      return appState;
  }
};
