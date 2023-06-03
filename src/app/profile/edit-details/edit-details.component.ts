import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProfileService} from "../../_services/profile.service";
import {Router} from "@angular/router";
import {ReplaySubject, takeUntil} from "rxjs";
import {Profile} from "../../_models";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AlertService} from "../../_services";
import {MatDialog} from '@angular/material/dialog';
import {DialogViewComponent} from "../dialog-view/dialog-view.component";
import * as moment from 'moment';

@Component({
  selector: 'app-edit-details',
  templateUrl: './edit-details.component.html',
  styleUrls: ['./edit-details.component.scss']
})
export class EditDetailsComponent implements OnInit, OnDestroy {

  constructor(
    private profileService: ProfileService,
    private router: Router,
    private alertService: AlertService,
    private dialog: MatDialog
  ) {
  }

  hide: boolean = false;
  profileData: Profile;
  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  alertMessage: string;
  form = new FormGroup({
    firstName: new FormControl('', [Validators.pattern('^(?=.{2,35}$).*')]),
    lastName: new FormControl('', [Validators.pattern('^(?=.{2,35}$).*')]),
    date: new FormControl(''),
    gender: new FormControl(''),
    imgUrl: new FormControl('')
  })

  url: string;
  oldImageUrl: string;
  newImageUrl: string;
  acceptedFilesFormats: string[] = ['png', 'jpg', 'jpeg', 'bpg'];

  openDialog(): void {
    this.alertService.clear();
    const dialogRef = this.dialog.open(DialogViewComponent, {
      width: '300px',
      data: {imgUrl: this.newImageUrl},
    });

    dialogRef.afterClosed().subscribe(result => {
      this.newImageUrl = result;
      if (this.newImageUrl !== undefined && this.newImageUrl !== '') {
        if (this.acceptedFilesFormats.includes(result.split('.').pop().toLowerCase())) {
          this.form.value.imgUrl = this.newImageUrl;
          this.url = this.newImageUrl;
          this.hide = true;
          return;
        }
        this.alertService.error('Некоректний формат файлу',true,true);
      }
    });
  }

  delete(): void {
    this.alertService.clear();
    this.hide = false
    this.url = this.oldImageUrl;
    this.form.value.imgUrl = this.oldImageUrl;
  }

  ngOnInit(): void {
    this.profileService.getProfileData()
      .pipe(takeUntil(this.destroy))
      .subscribe((data: Profile) => {
        this.profileData = data;
        this.form.setValue({
          firstName: this.profileData.firstName,
          lastName: this.profileData.lastName,
          date: moment(this.profileData.birthDate, "DD/MM/YYYY"),
          gender: this.profileData.gender,
          imgUrl: this.profileData.imgUrl
        });
        this.oldImageUrl = this.profileData.imgUrl;
        this.url = this.oldImageUrl;
      });
  }

  submit(): void {
    this.hide = false
    this.alertService.clear();
    let profile: Profile = {
      firstName: this.form.value.firstName,
      lastName: this.form.value.lastName,
      birthDate: this.form.value.date.format("DD/MM/YYYY"),
      gender: this.form.value.gender,
      imgUrl: this.form.value.imgUrl
    }
    this.profileService.saveChanges(profile)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: () => {
          this.alertService.success('Дані змінено.',true,true);
          this.router.navigateByUrl("/profile");
        },
        error: error => {
          switch (error.status) {
            case 400:
              this.alertMessage = "Щось пішло не так.";
              break;
            default:
              this.alertMessage = "Трапилася помилка."
              break;
          }
          this.alertService.error(this.alertMessage,true,true);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

  get firstNameErrorMessage(): string {
    return this.form.controls['firstName'].hasError('required') ?
      'Вкажіть коректне ім\'я' :
      this.form.controls['firstName'].hasError('pattern') ?
        'Ім\'я має містити лише літери та щонайменше два символи.' : '';
  }

  get lastNameErrorMessage(): string {
    return this.form.controls['lastName'].hasError('required') ?
      'Вкажіть коректне прізвище' :
      this.form.controls['lastName'].hasError('pattern') ?
        'Прізвище має містити лише літери та щонайменше два символи.' : '';
  }

  back(): void {
    this.router.navigateByUrl('/profile');
  }
}
