import {
  combineLatest,
  fromEvent,
  Observable,
  Subscription,
  concat,
  defer,
  of
} from "rxjs";
import {
  debounceTime,
  finalize,
  map,
  shareReplay,
  startWith,
  withLatestFrom,
  distinctUntilChanged
} from "rxjs/operators";
import { AbstractControl } from "@angular/forms";
import * as isEqual from "fast-deep-equal";

export function dirtyCheck<U>(control: AbstractControl, source: Observable<U>) {
  const valueChanges$ = concat(
    defer(() => of(control.value)),
    control.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
  );

  let subscription: Subscription;
  let isDirty = false;

  const isDirty$ = combineLatest(source, valueChanges$).pipe(
    map(([a, b]) => (isDirty = isEqual(a, b) === false)),
    finalize(() => subscription.unsubscribe()),
    startWith(false),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  subscription = fromEvent(window, "beforeunload")
    .pipe(withLatestFrom(isDirty$))
    .subscribe(([event, isDirty]) => isDirty && (event.returnValue = false));

  return isDirty$;
}
