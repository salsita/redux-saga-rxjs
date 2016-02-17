import React from 'react';
import { connect } from 'react-redux';

import * as ActionCreators from '../actions/actionCreators';

const renderUndoButton = (dispatch, undo, apiInProgress) => {
  if (undo.length > 0) {
    const lastUndo = undo[undo.length - 1];

    return <button disabled={apiInProgress} onClick={() => dispatch(ActionCreators.undo(lastUndo))}>Undo ({undo.length})</button>;
  } else {
    return false;
  }
};

const renderRedoButton = (dispatch, redo, apiInProgress) => {
  if (redo.length > 0) {
    const firstRedo = redo[0];

    return <button disabled={apiInProgress} onClick={() => dispatch(ActionCreators.redo(firstRedo))}>Redo ({redo.length})</button>;
  } else {
    return false;
  }
};

export default connect(appState => appState)(({ dispatch, apiInProgress, text, todos, commands }) => {
  return (
    <div>
      <ul>
        {todos.map((todo, index) => (
          <li
            key={index}
            style={{color: todo.transient ? 'red' : 'black'}}
            >{todo.title}</li>
        ))}
      </ul>
      <input
        type="text"
        value={text}
        onChange={ev => dispatch(ActionCreators.changeText(ev.target.value))}
        onKeyDown={ev => ev.keyCode === 13 ? dispatch(ActionCreators.addTodo(text)) : null} />
      {renderUndoButton(dispatch, commands.undo, apiInProgress)}
      {renderRedoButton(dispatch, commands.redo, apiInProgress)}
    </div>
  );
});
