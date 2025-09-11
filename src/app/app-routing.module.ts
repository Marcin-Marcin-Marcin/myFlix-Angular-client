import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [];

/**
 * AppRoutingModule
 *
 * Configures application routes and provides the RouterModule.
 * Currently no custom routes are defined here (see `app.module.ts` for routes).
 */
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
