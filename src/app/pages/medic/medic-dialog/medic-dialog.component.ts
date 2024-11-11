import { Component, Inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Medic } from '../../../model/medic';
import { FormsModule } from '@angular/forms';
import { MedicService } from '../../../services/medic.service';
import { switchMap } from 'rxjs';
import { SpecialtyService } from '../../../services/specialty.service';
import { Specialty } from '../../../model/specialty';

@Component({
  selector: 'app-medic-dialog',
  standalone: true,
  imports: [ MaterialModule, FormsModule ],
  templateUrl: './medic-dialog.component.html',
  styleUrl: './medic-dialog.component.css'
})
export class MedicDialogComponent implements OnInit
{
  medic: Medic;
  specialties: Specialty[];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data:Medic,
    private dialogRef: MatDialogRef<MedicDialogComponent>,
    private medicService: MedicService,
    private specialtyService: SpecialtyService
  )
  {}

  ngOnInit(): void {
    //this.medic = this.data;
    /*this.medic = new Medic();
    this.medic.idMedic = this.data.idMedic;
    this.medic.cmpMedic = this.data.cmpMedic;
    this.medic.primaryName = this.data.primaryName;
    this.medic.surname = this.data.surname;
    this.medic.photo = this.data.photo;*/
    this.medic = {...this.data};// El operador de propagación, estar haciendo una copia y sus atributos estan pasando
    this.specialtyService.findAll().subscribe(
      data => this.specialties = data
    );
  }

  close()
  {
    this.dialogRef.close();
  }

  operate()
  {
    if(this.medic != null && this.medic.idMedic >0)
    {
      //Update
      this.medicService.update(this.medic.idMedic,this.medic)
          .pipe(switchMap ( () => this.medicService.findAll()))
          .subscribe( data =>{
            this.medicService.setMedicChange(data);
            this.medicService.setMessageChange('UPDATED!');
          });
    }
    else
    {
      //Insert
      this.medicService.save(this.medic)
      .pipe(switchMap ( () => this.medicService.findAll()))
      .subscribe( data =>{
        this.medicService.setMedicChange(data);
        this.medicService.setMessageChange('CREATED!');
      });
    }
    this.close();
  }


}
