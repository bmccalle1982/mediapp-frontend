import { SpecialtyDeleteDialogComponent } from './specialty-delete-dialog/specialty-delete-dialog.component';
import { SpecialtyDialogComponent } from './specialty-dialog/specialty-dialog.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { MatTableDataSource } from '@angular/material/table';
import { Specialty } from '../../model/specialty';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SpecialtyService } from '../../services/specialty.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-specialty',
  standalone: true,
  imports: [ MaterialModule],
  templateUrl: './specialty.component.html',
  styleUrl: './specialty.component.css'
})
export class SpecialtyComponent implements OnInit
{

  dataSource: MatTableDataSource<Specialty>;
  columnsDefinitions = [
    { def: 'idSpecialty', label: 'idSpecialty', hide: true},
    { def: 'nameSpecialty', label: 'nameSpecialty', hide: false},
    { def: 'descriptionSpecialty', label: 'descriptionSpecialty', hide: false},
    { def: 'actions', label: 'actions', hide: false}
  ];

  @ViewChild(MatSort) matSort: MatSort;
  @ViewChild(MatPaginator) matPaginator: MatPaginator;

  constructor(
    private specialtyService: SpecialtyService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  )
  {}

  ngOnInit(): void {
    this.specialtyService.findAll().subscribe( data => {this.createTable(data)}) ;
    this.specialtyService.getSpecialtyChange().subscribe( data => this.createTable(data));
    this.specialtyService.getMessageChange().subscribe(
      data => this.snackBar.open(data,
                                 'Info',
                                 {duration: 3000,
                                  verticalPosition: 'top',
                                  horizontalPosition: 'right'})
    );
  }

  createTable(data: Specialty[])
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

  openDialog(specialty?: Specialty)
  {
    this.dialog.open(SpecialtyDialogComponent,{
      width:'750px',
      data: specialty
    });
  }

  delete(id: number)
  {
    const dialogRef = this.dialog.open(SpecialtyDeleteDialogComponent, {
      width: '250px',
      data: id
    });


    dialogRef.componentInstance.getResponse().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.specialtyService.delete(id)
        .pipe(switchMap( () => this.specialtyService.findAll()))
        .subscribe( data =>{
          this.specialtyService.setSpecialtyChange(data);
          this.specialtyService.setMessageChange('DELETED!');
      });
      } else {
        this.router.navigate(['pages/specialty']);
      }
    });


  }




}
