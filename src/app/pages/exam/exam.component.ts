import { ExamService } from './../../services/exam.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SpecialtyService } from '../../services/specialty.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Exam } from '../../model/exam';
import { ExamDeleteDialogComponent } from './exam-delete-dialog/exam-delete-dialog.component';
import { ExamDialogComponent } from './exam-dialog/exam-dialog.component';

@Component({
  selector: 'app-exam',
  standalone: true,
  imports: [ MaterialModule ],
  templateUrl: './exam.component.html',
  styleUrl: './exam.component.css'
})
export class ExamComponent {

  dataSource: MatTableDataSource<Exam>;
  columnsDefinitions = [
    { def: 'idExam', label: 'idExam', hide: true},
    { def: 'nameExam', label: 'nameExam', hide: false},
    { def: 'descriptionExam', label: 'descriptionExam', hide: false},
    { def: 'actions', label: 'actions', hide: false}
  ];

  @ViewChild(MatSort) matSort: MatSort;
  @ViewChild(MatPaginator) matPaginator: MatPaginator;

  constructor(
    private examService: ExamService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  )
  {}

  ngOnInit(): void {
    this.examService.findAll().subscribe( data => {this.createTable(data)}) ;
    this.examService.getExamChange().subscribe( data => this.createTable(data));
    this.examService.getMessageChange().subscribe(
      data => this.snackBar.open(data,
                                 'Info',
                                 {duration: 3000,
                                  verticalPosition: 'top',
                                  horizontalPosition: 'right'})
    );
  }

  createTable(data: Exam[])
  {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.matPaginator;
    this.dataSource.sort = this.matSort;
  }

  getDisplayedColumns(){
    return this.columnsDefinitions.filter( cd => !cd.hide).map( cd => cd.def);
  }

  applyFilter(e: any)
  {
    this.dataSource.filter = e.target.value.trim();
  }

  openDialog(exam?: Exam)
  {
    this.dialog.open(ExamDialogComponent,{
      width:'750px',
      data: exam
    });
  }

  delete(id: number)
  {
    const dialogRef = this.dialog.open(ExamDeleteDialogComponent, {
      width: '250px',
      data: id
    });


   dialogRef.componentInstance.getResponse().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.examService.delete(id)
        .pipe(switchMap( () => this.examService.findAll()))
        .subscribe( data =>{
          this.examService.setExamChange(data);
          this.examService.setMessageChange('DELETED!');
      });
      } else {
        this.router.navigate(['pages/exam']);
      }
    });

  }
}
