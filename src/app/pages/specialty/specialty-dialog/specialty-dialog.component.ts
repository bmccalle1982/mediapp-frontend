import { Component, Inject, OnInit } from '@angular/core';
import { Specialty } from '../../../model/specialty';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SpecialtyService } from '../../../services/specialty.service';
import { switchMap } from 'rxjs';
import { MaterialModule } from '../../../material/material.module';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-specialty-dialog',
  standalone: true,
  imports: [ MaterialModule, FormsModule],
  templateUrl: './specialty-dialog.component.html',
  styleUrl: './specialty-dialog.component.css'
})
export class SpecialtyDialogComponent implements OnInit
{
  specialty: Specialty;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data:Specialty,
    private dialogRef: MatDialogRef<SpecialtyDialogComponent>,
    private specialtyService: SpecialtyService
  )
  {}

  ngOnInit(): void {
    this.specialty = {...this.data};
  }

  close()
  {
    this.dialogRef.close();
  }

  operate()
  {
    if(this.specialty != null && this.specialty.idSpecialty >0)
    {
      //Update
      this.specialtyService.update(this.specialty.idSpecialty,this.specialty)
          .pipe(switchMap ( () => this.specialtyService.findAll()))
          .subscribe( data =>{
            this.specialtyService.setSpecialtyChange(data);
            this.specialtyService.setMessageChange('UPDATED!');
          });
    }
    else
    {
      //Insert
      this.specialtyService.save(this.specialty)
      .pipe(switchMap ( () => this.specialtyService.findAll()))
      .subscribe( data =>{
        this.specialtyService.setSpecialtyChange(data);
        this.specialtyService.setMessageChange('CREATED!');
      });
    }
    this.close();
  }


}
