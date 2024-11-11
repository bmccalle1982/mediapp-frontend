import { Component, OnInit, ViewChild } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../model/patient';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from '../../material/material.module';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [MaterialModule, RouterLink, RouterOutlet],
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.css'
})
export class PatientComponent implements OnInit
{
  dataSource: MatTableDataSource<Patient>;
  //displayedColumns: string[] = ['idPatient', 'firstName', 'lastName', 'dni'];
  columnsDefinitions = [
    { def: 'idPatient', label: 'idPatient', hide: true},
    { def: 'firstName', label: 'firstName', hide: false},
    { def: 'lastName', label: 'lastName', hide: false},
    { def: 'dni', label: 'dni', hide: false},
    { def: 'actions', label: 'actions', hide: false}
  ];

  @ViewChild(MatSort) matSort: MatSort;
  @ViewChild(MatPaginator) matPaginator: MatPaginator;

  constructor(
    private patientService: PatientService,
    private snackBar: MatSnackBar
    ){}

  ngOnInit(): void
  {
    //El observable es un flujo de datos y va a reccionar a el
    this.patientService.findAll().subscribe( data => {
      this.createTable(data);
    });

    this.patientService.getPatientChange().subscribe(data => this.createTable(data));
    this.patientService.getMessageChange().subscribe(
      data => this.snackBar.open(data,
                                 'Info',
                                 {duration: 3000,
                                  verticalPosition: 'top',
                                  horizontalPosition: 'right'})
    );
  }

  createTable(data: Patient[])
  {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.matSort;
    this.dataSource.paginator = this.matPaginator;
  }

  getDisplayedColumns(){
    return this.columnsDefinitions.filter( cd => !cd.hide).map( cd => cd.def);
  }

  applyFilter(e: any)
  {
    this.dataSource.filter = e.target.value.trim();
  }

  delete(id: number)
  {
    this.patientService.delete(id)
        .pipe(switchMap( () => this.patientService.findAll()))
        .subscribe( data =>{
          this.patientService.setPatientChange(data);
          this.patientService.setMessageChange('DELETED!');
        });
  }

}
