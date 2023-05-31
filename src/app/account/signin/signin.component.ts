import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReCaptcha2Component } from 'ngx-captcha';
import { ReplaySubject, takeUntil } from 'rxjs';
import { CookieStorageService } from 'src/app/_helpers/cookies.storage';
import { AlertService } from 'src/app/_services';
import { AuthService } from 'src/app/_services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit,OnDestroy {
  form: FormGroup;
  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  alertMessage: string;
  hide: boolean = true;
  siteKey: string = environment.siteKey;
  isCaptcha: boolean = false;
  @ViewChild('captchaElem') captchaElem: ReCaptcha2Component;

constructor(
  private formBuilder: FormBuilder,
  private authService: AuthService,
  private router: Router,
  private cookie: CookieStorageService,
  private alertService: AlertService,
){
}
  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

ngOnInit(){
  this.form = this.formBuilder.group({
    email: ['', Validators.email],
    password: ['', Validators.required],
    recaptcha: []
  });}

get control(){return this.form.controls}

onSubmit() {
  this.alertService.clear();
  if (this.form.valid) {
    this.authService.signIn(this.control['email'].value, this.control['password'].value, this.control['recaptcha'].value)
            .pipe(takeUntil(this.destroy))
            .subscribe({
                next: next => {
                  this.cookie.setToken(next.token);
                  this.router.navigateByUrl('/profile');
              },
                error: error => {
                  switch(error.status){
                    case 400:
                      this.alertMessage = "Некоректний формат електронної пошти.";
                      break;
                      case 401:
                        this.alertMessage = "Облікові дані некоректні.";
                        break;
                      case 422:
                        this.alertMessage = "Підтвердьте що ви не робот.";
                        this.isCaptcha = true;
                        this.form.controls['recaptcha'].addValidators(Validators.required);
                        break;
                      default:
                        this.alertMessage = "На сервері трапилася помилка, спробуйте пізніше.."
                        break;
                  }
                this.alertService.error(this.alertMessage);}
            });
    if (this.isCaptcha)
      this.captchaElem.resetCaptcha();
  }
}

}
