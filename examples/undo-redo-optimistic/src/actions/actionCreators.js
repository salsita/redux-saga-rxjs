import * as Actions from '../constants/actions';

export const changeText = text => ({ type: Actions.CHANGE_TEXT, payload: text });
export const addTodo = title => ({ type: Actions.ADD_TODO, payload: title });
export const undo = command => ({ type: Actions.UNDO, payload: command });
export const redo = command => ({ type: Actions.REDO, payload: command });
export const addTodoId = (clientId, title) => ({ type: Actions.ADD_TODO_ID, payload: { clientId, title }});
export const clearRedoLog = () => ({ type: Actions.CLEAR_REDO_LOG, payload: null });
export const todoAdded = (serverId, clientId, command) => ({ type: Actions.TODO_ADDED, payload: { serverId, clientId, command }});
export const addTodoFailed = clientId => ({ type: Actions.ADD_TODO_FAILED, payload: clientId });
export const undone = action => ({ type: Actions.UNDONE, payload: action });
export const undoFailed = serverId => ({ type: Actions.UNDO_FAILED, payload: serverId });
export const redone = () => ({ type: Actions.REDONE, payload: null });
