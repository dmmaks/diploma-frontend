import { Component, OnDestroy, OnInit } from '@angular/core';
import { PasswordValidatorShared } from "../../account/sharedClass/passwordValidatorShared";
import { ReplaySubject, takeUntil } from "rxjs";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { MustMatch } from "../../_helpers";
import { AlertService } from "../../_services";
import { ProfileService } from "../../_services/profile.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent extends PasswordValidatorShared implements OnDestroy, OnInit {

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private alertService: AlertService,
    private profileService: ProfileService
  ) {
    super();
  }

  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  alertMessage: string;
  hideOld: boolean = true;
  hideNew: boolean = true;
  hideConfirm: boolean = true;

  ngOnInit(): void {
    this.form = this.fb.group({
      password: new FormControl('', [Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,32}$')]),
      newPassword: new FormControl('', [Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,32}$')]),
      confirmPassword: new FormControl('')
    },
      {
        validator: MustMatch('newPassword', 'confirmPassword')
      });
  }

  get newPasswordErrorMessage(): string {
    return this.form.controls['newPassword'].hasError('required') ?
      'Будь ласка, вкажіть пароль' :
      this.control['password'].hasError('pattern') ?
        'Пароль мусить містити прнаймні 8 символів, одну велику літеру, одну малу та одну цифру' : '';
  }

  changePassword(): void {
    this.alertService.clear();
    this.profileService.changePassword(this.form.value.password, this.form.value.newPassword)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: () => {
          this.alertService.success('Пароль змінено.', true, true);
        },
        error: error => {
          switch (error.status) {
            case 400:
              this.alertMessage = "Щось пішло не так.";
              break;
            case 409:
              this.alertMessage = "Некоректний старий пароль.";
              break;
            default:
              this.alertMessage = "Трапилася серверна помилка, спробуйте пізніше.."
              break;
          }
          this.alertService.error(this.alertMessage, true, true);
        }
      });
  }

  back(): void {
    this.router.navigateByUrl('/profile');
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.code === "Space") {
      event.preventDefault();
    }
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }
}
