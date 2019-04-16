import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { dirtyCheck, DirtyComponent } from '../dirty-check';
import { store, store$ } from '../store';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit, DirtyComponent {
  settings = new FormGroup({
    settingOne: new FormControl(null),
    settingTwo: new FormControl(null),
    settingThree: new FormControl(true),
  });

  isDirty$: Observable<boolean>;

  ngOnInit() {
    this.isDirty$ = this.settings.valueChanges.pipe(
      dirtyCheck(store$),
    );

    store$.pipe(untilDestroyed(this)).subscribe(state => this.settings.patchValue(state, { emitEvent: false }));
  }

  ngOnDestroy() {}

  submit() {
    store.next(this.settings.value);
  }
}

