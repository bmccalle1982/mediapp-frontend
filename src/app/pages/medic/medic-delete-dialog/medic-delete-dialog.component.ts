import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { Subject } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-medic-delete-dialog',
  standalone: true,
  imports: [ MaterialModule],
  templateUrl: './medic-delete-dialog.component.html',
  styleUrl: './medic-delete-dialog.component.css'
})
export class MedicDeleteDialogComponent
{
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
