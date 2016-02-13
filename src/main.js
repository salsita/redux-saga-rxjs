import { Subject } from 'rxjs';

const sagaMiddleware = (...sagas) => {
  const subject = new Subject();

  return store => {
    sagas.forEach(saga =>
        saga(subject).subscribe(dispatchable => store.dispatch(dispatchable));

    return next => action => {
      next(action);
      subject.next(action, store.getState());
    };
  };
};
