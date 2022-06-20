import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AddCustomerCComponent } from './add-customer-c/add-customer-c.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditCustomerCComponent } from './add-customer-c/edit-customer-c.component';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";


@NgModule({
  declarations: [AddCustomerCComponent,EditCustomerCComponent],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GooglePlaceModule
  ],
  exports: [AddCustomerCComponent, EditCustomerCComponent]
})
export class AddCustomerCModule { }
