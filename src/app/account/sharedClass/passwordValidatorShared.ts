import {FormGroup} from "@angular/forms";

export class PasswordValidatorShared {
  form: FormGroup;

  get control() {
    return this.form.controls;
  }

  get passwordErrorMessage(): string {
    return this.control['password'].hasError('required') ?
      'Введіть, будь ласка, пароль' :
      this.control['password'].hasError('pattern') ?
        'Пароль має містити щонайменше 8 символів, одну велику літеру, одну малу літеру та цифру' : '';
  }

  get confirmPasswordErrorMessage(): string {
    return this.control['confirmPassword'].hasError('required') ?
      'Введіть, будь ласка, пароль' :
      this.control['confirmPassword'].hasError('mustMatch') ?
        'Паролі не збігаються' : '';
  }
}
