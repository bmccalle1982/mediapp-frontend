import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { Subject } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-specialty-delete-dialog',
  standalone: true,
  imports: [ MaterialModule],
  templateUrl: './specialty-delete-dialog.component.html',
  styleUrl: './specialty-delete-dialog.component.css'
})
export class SpecialtyDeleteDialogComponent {

  responseSubject = new Subject<boolean>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public id: number,
    private dialog: MatDialog
    ){}

  onConfirm(): void {
    this.responseSubject.next(true);
    this.dialog.closeAll();
  }

  onCancel(): void {
    this.responseSubject.next(false);
    this.dialog.closeAll();
  }

  getResponse() {
    return this.responseSubject.asObservable();
  }

}
