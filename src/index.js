import { Subject } from 'rxjs';

export default (...sagas) => {
  const subject = new Subject();

  return store => {
    sagas.forEach(saga =>
        saga(subject).subscribe(dispatchable => store.dispatch(dispatchable)));

    return next => action => {
      next(action);
      subject.next(action, store.getState());
    };
  };
};
