import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
enum FormField {
  email = 'email',
  password = 'password'
}
class UserLogin {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();
  FormField = FormField;
  form: FormGroup;
  submited = false;
  constructor(private spiner: NgxSpinnerService, private router: Router, public alertController: AlertController, private formBuilder: FormBuilder, private authService: AuthService) { }
  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngOnInit() {



    this.form = this.formBuilder.group({
      [FormField.email]: [null, [Validators.required, Validators.email]],
      [FormField.password]: [null, [Validators.required]]
    });
  }
  async installApp()  {
    if (window['deferredPrompt'] !== null && window['deferredPrompt'] !== undefined ) {
      window['deferredPrompt'].prompt();
      const { outcome } = await window['deferredPrompt'].userChoice;
      if (outcome === 'accepted') {
        window['deferredPrompt'] = null;
      }
  }
  }
  navigateHome() {
    this.router.navigate(['/home'])
  }
  login() {
    this.spiner.show();
    this.submited = true;
    if (this.form.valid) {
      if (this.form.controls[FormField.email].status === 'INVALID') {
        this.notifyCreate("Thông tin không hợp lệ", "Địa chỉ email không hợp lệ");
        return;
      }
      const user: UserLogin = this.form.getRawValue() as UserLogin
      this.authService.login(user.email, user.password).
        pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          this.spiner.hide();
          this.router.navigate(['/home/tabs/tab1'])
        }, error => {
          this.spiner.hide();
          if (error.code === 'auth/user-not-found') {
            this.notifyCreate("Vui lòng kiểm tra địa chỉ email", "Địa chỉ email không tồn tại");
            return;
          }
          if (error.code === 'auth/wrong-password') {
            this.notifyCreate("Vui lòng kiểm tra mật khẩu", "Mật khẩu không đúng");
            return;
          }
        })
    } else {
      this.spiner.hide();
    }

  }
  notifyCreate(header: string, massage: string) {
    this.alertController.create({
      mode: 'ios',
      header: header,
      message: massage,
      buttons: [{
        text: 'OK'
      }]
    }).then(alert => { alert.present(); });
  }
}
