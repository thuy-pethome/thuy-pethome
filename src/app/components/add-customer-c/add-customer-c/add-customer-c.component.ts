import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CustomerModel } from 'src/app/services/entitys/customer.model';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';

enum FormField {
  fullName = 'fullName',
  phone = 'phone',
  address = 'address',
  desc = 'desc',
}
export class DataModel extends CustomerModel {}

@Component({
  selector: 'app-add-customer-c',
  templateUrl: './add-customer-c.component.html',
  styleUrls: ['./add-customer-c.component.scss'],
})
export class AddCustomerCComponent implements OnInit, OnDestroy {
  FormField = FormField;
  form: FormGroup;
  @Input() data: DataModel;
  @Output() onSubmit = new EventEmitter<DataModel>();
  submited = false;
  @Input() popup: boolean = false;
  destroy$ = new Subject();
  @Output() onBack = new EventEmitter<DataModel>();
  options: Options = new Options({
    fields: ['formatted_address', 'geometry', 'name'],
    types: ['address'],
    strictBounds: false,
    bounds: undefined,
  });
  constructor(
    protected alertController: AlertController,
    protected formBuilder: FormBuilder,
    protected modalCtrl: ModalController
  ) {}
  public handleAddressChange(address: Address) {
    this.form.controls[FormField.address].setValue(address.formatted_address);
    // Do some stuff
  }
  valueChange(event) {
    this.form.controls[FormField.address].setValue(event.target.value);
  }
  ngOnInit() {
    this.forworder();
    this.form = this.formBuilder.group({
      [FormField.fullName]: [this.data.fullName, [Validators.required]],
      [FormField.phone]: [
        this.data.phone,
        [Validators.pattern(/((09|03|07|08|05)+([0-9]{8})\b)/g)],
      ],
      [FormField.address]: [this.data.address],
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  async submit() {
    this.submited = true;
    if (this.form.controls[FormField.fullName].errors) {
      this.notifyCreate(
        'Thông tin không hợp lệ',
        'Vui lòng điền họ và tên khách hàng'
      );
      return;
    }
    if (this.form.controls[FormField.phone].errors) {
      this.notifyCreate('Thông tin không hợp lệ', 'Số điện thoại không hợp lệ');
      return;
    }
    if (this.form.valid) {
      this.onSubmit.emit(Object.assign(this.data, this.form.getRawValue()));
      // await this.modalCtrl.dismiss({
      //   data: Object.assign(this.data ,this.form.getRawValue())
      //  });
    }
  }
  forworder() {
    if (this.popup) {
      const map = {
        onSubmit: this.onSubmit,
        onBack: this.onBack,
      };
      Object.keys(map).forEach((key) => {
        map[key].pipe(takeUntil(this.destroy$)).subscribe((data) => {
          this.modalCtrl.dismiss({
            action: key,
            state: data,
          });
        });
      });
    }
  }
  notifyCreate(header: string, massage: string) {
    this.alertController
      .create({
        mode: 'ios',
        header: header,
        message: massage,
        buttons: [
          {
            text: 'OK',
          },
        ],
      })
      .then((alert) => {
        alert.present();
      });
  }
}
