import { Subject } from 'rxjs';

const isFunction = any => typeof any === 'function';

const invariant = (condition, message) => {
  if (condition) {
    throw new Error(`Invariant violation: ${message}`);
  }
};

export default (...sagas) => {
  const subject = new Subject();

  invariant(!sagas.every(isFunction),
      'All the provided sagas must be typeof function');

  return store => {
    sagas.forEach(saga =>
        saga(subject)
          .subscribe(dispatchable => store.dispatch(dispatchable)));

    return next => action => {
      next(action);
      subject.next({action, state: store.getState()});
    };
  };
};
