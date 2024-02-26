import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TerminosComponent } from './terminos/terminos.component';
import { FormularioComponent } from './formulario/formulario.component';

const routes: Routes = [
  { path: 'formulario', component: FormularioComponent },
  { path: 'terminos', component: TerminosComponent },
  { path: '', redirectTo: '/formulario', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule] 
})
export class AppRoutingModule { }
