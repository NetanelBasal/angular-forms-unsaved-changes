import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { DirtyComponent } from "../dirty-check";
import { store, store$ } from "../store";
import { untilDestroyed } from "ngx-take-until-destroy";
import { dirtyCheck as dirtyCheckV2 } from "../dirty-check-v2";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html"
})
export class SettingsComponent implements OnInit, DirtyComponent {
  settings = new FormGroup({
    settingOne: new FormControl(null),
    settingTwo: new FormControl(null),
    settingThree: new FormControl(true)
  });

  isDirty$ = dirtyCheckV2(this.settings, store$);

  ngOnInit() {
    store$
      .pipe(untilDestroyed(this))
      .subscribe(state =>
        this.settings.patchValue(state, { emitEvent: false })
      );
  }

  ngOnDestroy() {}

  submit() {
    store.next(this.settings.value);
  }
}
