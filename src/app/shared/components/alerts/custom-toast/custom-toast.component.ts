import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Toast } from 'ngx-toastr';

@Component({
  selector: 'app-custom-toast',
  imports: [CommonModule],
  styles: [`
    :host {
      background-color: #FF69B4;
      position: relative;
      overflow: hidden;
      margin: 0 0 6px;
      padding: 10px 10px 10px 10px;
      width: 300px;
      border-radius: 3px 3px 3px 3px;
      color: #FFFFFF;
      pointer-events: all;
      cursor: pointer;
    }
    .btn-pink {
      -webkit-backface-visibility: hidden;
      -webkit-transform: translateZ(0);
    }
  `],
  template: `
    <div
      class="row"
      [style.display]="state().value === 'inactive' ? 'none' : ''"
    >
      <div class="col-9">
        <div
          *ngIf="title"
          [class]="options.titleClass"
          [attr.aria-label]="title"
        >
          {{ title }}
        </div>
        <div
          *ngIf="message && options.enableHtml"
          role="alert"
          [class]="options.messageClass"
          [innerHTML]="message"
        ></div>
        <div
          *ngIf="message && !options.enableHtml"
          role="alert"
          [class]="options.messageClass"
          [attr.aria-label]="message"
        >
          {{ message }}
        </div>
      </div>
      <div class="col-3 text-right">
        <a
          *ngIf="!options.closeButton"
          class="btn btn-pink btn-sm"
          (click)="action($event)"
        >
          {{ undoString }}
        </a>
        <a
          *ngIf="options.closeButton"
          (click)="remove()"
          class="btn btn-pink btn-sm"
        >
          close
        </a>
      </div>
    </div>
    <div *ngIf="options.progressBar">
      <div class="toast-progress" [style.width]="width() + '%'"></div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomToastComponent extends Toast {
  undoString = 'undo';

  action(event: Event) {
    event.stopPropagation();
    this.undoString = 'undid';
    this.toastPackage.triggerAction();
    return false;
  }
}
