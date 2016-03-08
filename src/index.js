import { Subject } from 'rxjs';

const isFunction = any => typeof any === 'function';

const invariant = (condition, message) => {
  if (condition) {
    throw new Error(`Invariant violation: ${message}`);
  }
};

export default (...sagas) => {
  const subject = new Subject();

  invariant(sagas.length === 0,
    'Provide at least one saga as argument');

  invariant(!sagas.every(isFunction),
      'All the provided sagas must be typeof function');

  return store => {
    sagas.forEach(saga => {
      const iterable = saga(subject);

      invariant(iterable === subject,
        'It is not allowed to provide identity (empty) saga');

      iterable.subscribe(dispatchable => store.dispatch(dispatchable));
    });

    return next => action => {
      const result = next(action);
      subject.next({action, state: store.getState()});
      return result;
    };
  };
};
