import { Component, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { MaterialModule } from '../../../material/material.module';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-exam-delete-dialog',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './exam-delete-dialog.component.html',
  styleUrl: './exam-delete-dialog.component.css'
})
export class ExamDeleteDialogComponent {


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
