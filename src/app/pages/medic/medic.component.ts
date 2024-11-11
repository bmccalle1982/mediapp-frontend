import { MedicDeleteDialogComponent } from './medic-delete-dialog/medic-delete-dialog.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { MatTableDataSource } from '@angular/material/table';
import { Medic } from '../../model/medic';
import { MedicService } from '../../services/medic.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MedicDialogComponent } from './medic-dialog/medic-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-medic',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './medic.component.html',
  styleUrl: './medic.component.css'
})
export class MedicComponent implements OnInit
{
  dataSource: MatTableDataSource<Medic>;
  columnsDefinitions = [
    { def: 'idMedic', label: 'idMedic', hide: true},
    { def: 'primaryName', label: 'primaryName', hide: false},
    { def: 'surname', label: 'surname', hide: false},
    { def: 'actions', label: 'actions', hide: false}
  ];

  @ViewChild(MatSort) matSort: MatSort;
  @ViewChild(MatPaginator) matPaginator: MatPaginator;


  constructor(
    private medicService: MedicService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  )
  {}

  ngOnInit(): void {
    this.medicService.findAll().subscribe( data => {this.createTable(data)}) ;
    this.medicService.getMedicChange().subscribe( data => this.createTable(data));
    this.medicService.getMessageChange().subscribe(
      data => this.snackBar.open(data,
                                 'Info',
                                 {duration: 3000,
                                  verticalPosition: 'top',
                                  horizontalPosition: 'right'})
    );
  }

  createTable(data: Medic[])
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

  //medic?-->indica que el valor puede llegar sin parámetro, es opcional
  openDialog(medic?: Medic)
  {
    this.dialog.open(MedicDialogComponent,{
      width:'750px',
      data: medic
    });
  }

  delete(id: number)
  {
    //Puede utilizar un subject que utilizar un booleano, subject true, elimina el registro
    /* this.dialog.open(MedicDeleteDialogComponent,{
        width: '200px',
        data: id
      });
      */
      // Abrimos el diálogo de confirmación para eliminar
      const dialogRef = this.dialog.open(MedicDeleteDialogComponent, {
        width: '250px',
        data: id
      });

      dialogRef.componentInstance.getResponse().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.medicService.delete(id)
          .pipe(switchMap( () => this.medicService.findAll()))
          .subscribe( data =>{
            this.medicService.setMedicChange(data);
            this.medicService.setMessageChange('DELETED!');
        });
        } else {
          this.router.navigate(['pages/medic']);
        }
      });
  }

}
