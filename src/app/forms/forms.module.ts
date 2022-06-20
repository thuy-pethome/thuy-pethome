import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormsPageRoutingModule } from './forms-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/regiser/register.component';
import { BlockComponent } from './pages/block/block.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [LoginComponent, RegisterComponent, BlockComponent]
})
export class FormsPageModule { }
