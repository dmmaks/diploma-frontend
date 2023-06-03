import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, takeUntil } from 'rxjs';
import { MustMatch } from 'src/app/_helpers/must-match.validator';
import { AlertService, AuthService } from 'src/app/_services';
import { PasswordValidatorShared } from '../sharedClass/passwordValidatorShared';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent extends PasswordValidatorShared implements OnDestroy {
  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  alertMessage: string;
  hide: boolean = true;
  hideConfirm: boolean = true;

constructor(
  private formBuilder: FormBuilder,
  private authService: AuthService,
  private route: ActivatedRoute,
  private router: Router,
  private alertService: AlertService
){
  super();
  this.form = this.formBuilder.group({
    firstName: [null, [Validators.required, Validators.pattern('^([A-Z a-z]){2,35}$')]],
    lastName: [null, [Validators.required, Validators.pattern('^([A-Z a-z]){3,35}$')]],
    birthDate: ['', Validators.required],
    email: ['', Validators.email],
    password: [null, [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,32}$')]],
    confirmPassword: ['', Validators.required],
    gender: ['', Validators.required]
  }, {
    validator: MustMatch('password', 'confirmPassword')
  } as AbstractControlOptions
  );
}
  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

get firstNameErrorMessage(): string {
  return this.control['firstName'].hasError('required') ?
    'Вкажіть ім\'я' :
    this.control['firstName'].hasError('pattern') ?
    'Ім\'я мусить містити лише літери та щонайменше два символи' : '';
}

onSubmit(): void {
  this.alertService.clear();
  if (this.form.valid) {
    console.log(this.control['birthDate'].value);
    this.authService.signUp(this.form.value)
            .pipe(takeUntil(this.destroy))
            .subscribe({
              next: () => {
                this.alertService.success('Реєстрація успішна.', true);
                this.router.navigate(['../signin'], { relativeTo: this.route });
              },
                error: error => {
                  switch(error.status){
                    case 400:
                      this.alertMessage = "Щось пішло не так.";
                      break;
                    case 422:
                    this.alertMessage = "Обліковий запис із такою поштою вже існує.";
                      break;
                      default:
                        this.alertMessage = "На сервері трапилася помилка, спробуйте пізніше.."
                        break;
                  }
                  this.alertService.error(this.alertMessage);
            }});
    }
  }

}
