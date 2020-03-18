import { Injectable } from "@angular/core";
import { CanDeactivate } from "@angular/router";
import { of } from "rxjs";
import { map, switchMap, take } from "rxjs/operators";
import { NzModalService } from "ng-zorro-antd";
import { DirtyComponent } from "./dirty-check";

@Injectable({ providedIn: "root" })
export class DirtyCheckGuard implements CanDeactivate<DirtyComponent> {
  constructor(private modalService: NzModalService) {}

  canDeactivate(component: DirtyComponent) {
    return component.isDirty$.pipe(
      switchMap(dirty => {
        if (dirty === false) {
          return of(true);
        }

        let navigate;
        return this.modalService
          .confirm({
            nzTitle: "Confirm",
            nzContent:
              "You have unsaved changes. Are you sure you want to leave?",
            nzOkText: "Stay",
            nzCancelText: "Leave",
            nzOnOk() {
              navigate = false;
            },
            nzOnCancel() {
              navigate = true;
            }
          })
          .afterClose.pipe(map(() => navigate));
      }),
      take(1)
    );
  }
}
