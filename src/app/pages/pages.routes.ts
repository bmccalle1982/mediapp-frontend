import { Routes } from "@angular/router";
import { PatientComponent } from "./patient/patient.component";
import { PatientEditComponent } from "./patient/patient-edit/patient-edit.component";
import { MedicComponent } from "./medic/medic.component";
import { SpecialtyComponent } from "./specialty/specialty.component";
import { ExamComponent } from "./exam/exam.component";

export const pagesRoutes: Routes = [
  { path: 'patient', component: PatientComponent, children:[
    { path: 'new', component: PatientEditComponent},
    { path: 'edit/:id', component: PatientEditComponent},
  ]},
  { path: 'medic', component: MedicComponent},
  { path: 'specialty', component: SpecialtyComponent},
  { path: 'exam', component: ExamComponent}
]
