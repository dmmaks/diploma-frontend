import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {PageEvent} from "@angular/material/paginator";
import {Observable, ReplaySubject} from "rxjs";
import {AlertService, AuthService, DishService, IngredientService} from "../../_services";
import {Page} from "../../_models/page";
import {map, startWith, takeUntil} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import { Dish } from 'src/app/_models/dish';
import { IngredientFilter } from 'src/app/_models/_filters/ingredient.filter';
import { DishIngredientFilter } from 'src/app/_models/_filters/dish-ingredient-filter';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { SearchDishParams } from 'src/app/_models/search-dish-params';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ViewTechniqueMitigationComponent } from '../view-technique-mitigation/view-technique-mitigation.component';
import { Sort, SortDirection } from '@angular/material/sort';
import { ModelGenerationDeviceFilter } from 'src/app/_models/_filters/model-generation-device-filter';
import { SearchDeviceParams } from 'src/app/_models/search-device-params';
import { DeviceService } from 'src/app/_services/device.service';
import { GeneratedModel } from 'src/app/_models/generated-model';
import { Device } from 'src/app/_models/device';
import { ModelGenerationService } from 'src/app/_services/model-generation.service';
import { TechniqueMitigationService } from 'src/app/_services/technique-mitigation.service';
import { Checklist } from 'src/app/_models/checklist';
import { ChecklistService } from 'src/app/_services/checklist.service';


@Component({
  selector: 'checklist-list-page.component',
  templateUrl: './checklist-list-page.component.html',
  styleUrls: ['./checklist-list-page.component.scss']
})
export class ChecklistListPageComponent {
  checklists: Checklist[] = [];

  pageContent: Page<Dish>;
  categories: string[] = [];
  ingredients: DishIngredientFilter[] = [];
  selectedIngredients: DishIngredientFilter[] = [];
  selectedIngredientsIds: string[] = [];
  filteredIngredients: Observable<DishIngredientFilter[]>;
  searchForm: FormGroup;
  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  columnsToDisplay = ['checklist', 'device'];
  pageSize: number = 12;
  currentPage: number;
  alertMessage: string;
  ingredientControl = new FormControl();
  separatorKeysCodes: number[] = [ENTER, COMMA];
  isFilteredByStock: boolean;
  isFilteredByFavorite: boolean;
  userRole?: string;
  isWithActions: string;
  sortOrder: SortDirection = 'asc';
  @ViewChild('ingredientInput') ingredientInput: ElementRef<HTMLInputElement>;

  constructor(
    private checklistService: ChecklistService,
    private deviceService: DeviceService,
    private modelGenerationService: ModelGenerationService,
    private techniqueMitigationService: TechniqueMitigationService,
    private dishService: DishService,
    private ingredientService: IngredientService,
    private alertService: AlertService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
  }
  

  ngOnInit(): void {
    this.searchForm = this.createFormGroup();
    this.getChecklistsBySearch("");
  }

  createFormGroup(): FormGroup {
    return this.formBuilder.group({
      name: ['']
    });
  }

  getChecklistsBySearch(searchText: string) : void {
    this.checklists = [];
    this.checklistService.getChecklists(searchText)
      .pipe(takeUntil(this.destroy))
      .subscribe(
        {next: response => {
          this.checklists = response
          },
          error: error => {
            this.displayError(error);
          }}
      )
  }

  performSearch() : void {
    this.getChecklistsBySearch(this.searchForm.value.name);
  }

  // filterDevices(value: string): ModelGenerationDeviceFilter[] {
  //   this.getDevices(String(value));
  //   return this.devices;
  // }

  // generateModel() : void {
  //   if (this.deviceControl.valid) {
  //     this.modelGenerationService.generateModelById(this.selectedDeviceId)
  //       .pipe(takeUntil(this.destroy))
  //       .subscribe({
  //         next: response => {
  //           this.generatedModel = response;
  //           this.alertService.success('Чек-лист було згенеровано', true, true);
  //         },
  //         error: error => {
  //           this.displayError(error);
  //         }
  //       });
  //     }
  // }

  // onDeviceSelected(event: MatAutocompleteSelectedEvent): void {
  //   this.selectedDeviceId = event.option.value.id;
  // }

  // displayDevice(device: Device): string {
  //   return device ? device.name : '';
  // }

  openTechniqueDialog(id: string): void {
    console.log(id);
    this.techniqueMitigationService.getTechniqueById(id)
        .pipe(takeUntil(this.destroy))
        .subscribe({
          next: response => {
            const dialogRef = this.dialog.open(ViewTechniqueMitigationComponent, {
              data: {techniqueMitigation: response}
            });
          },
          error: error => {
            switch(error.status){
              case 404:
                this.alertService.error(error.error.message, false, false, "error-dialog");
                break;
              default:
                this.alertService.error("несподівана помилка, спробуйте пізніше", false, false, "error-dialog");
                break;
            }
            this.alertService.error(this.alertMessage);
          }});
  }

  openMitigationDialog(id: string): void {
    this.techniqueMitigationService.getMitigationById(id)
        .pipe(takeUntil(this.destroy))
        .subscribe({
          next: response => {
            const dialogRef = this.dialog.open(ViewTechniqueMitigationComponent, {
              data: {techniqueMitigation: response}
            });
          },
          error: error => {
            switch(error.status){
              case 404:
                this.alertService.error(error.error.message, false, false, "error-dialog");
                break;
              default:
                this.alertService.error("несподівана помилка, спробуйте пізніше", false, false, "error-dialog");
                break;
            }
            this.alertService.error(this.alertMessage);
          }});
  }


  //------------------------------------------------------

  searchDishes() : void {
    if (this.isFilteredByStock) {
      this.getStockDishPage(0, this.pageSize);
     }
     else if (this.isFilteredByFavorite) {
      this.getFavoriteDishPage(0, this.pageSize);
     } 
     else {
       this.getBySearch();
     }
  }


  getBySearch(): void {
    const filter: SearchDishParams = this.searchForm.value;
    filter.order = this.sortOrder;
    filter.ingredients = this.selectedIngredientsIds.toString();
    this.dishService.getDishesBySearch(this.searchForm.value, this.pageSize)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: response => {
          this.pageContent = response;
          this.currentPage = 0;
        },
        error: error => {
          this.displayError(error);
        }
      });
  }

  getDishPage(pageIndex: number, pageSize: number): void {
    this.dishService.getDishesByPageNum(pageIndex, pageSize)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: response => {
          this.pageContent = response;
          this.currentPage = pageIndex;
          this.pageSize = pageSize;
        },
        error: error => {
          this.displayError(error);
        }
      });
  }

  getStockDishPage(pageIndex: number, pageSize: number): void {
    this.dishService.getStockDishes(pageIndex, pageSize)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: response => {
          this.pageContent = response;
          this.currentPage = pageIndex;
          this.pageSize = pageSize;
        },
        error: error => {
          this.displayError(error);
        }
      });
  }

  getFavoriteDishPage(pageIndex: number, pageSize: number): void {
    this.dishService.getFavoriteDishes(pageIndex, pageSize)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: response => {
          this.pageContent = response;
          this.currentPage = pageIndex;
          this.pageSize = pageSize;
        },
        error: error => {
          this.displayError(error);
        }
      });
  }


  paginationHandler(pageEvent: PageEvent): void {
    if (this.isFilteredByStock) {
      this.getStockDishPage(pageEvent.pageIndex, pageEvent.pageSize);
    }
    else if (this.isFilteredByFavorite) {
      this.getFavoriteDishPage(pageEvent.pageIndex, pageEvent.pageSize);
    }
    else {
      this.getDishPage(pageEvent.pageIndex, pageEvent.pageSize);
    }
  }

  getCategories() {
    this.dishService.getAllCategories()
      .pipe(takeUntil(this.destroy))
      .subscribe(
        {next: response => {
          response.forEach( x => {
            this.categories.push(x);
          })
          },
          error: error => {
            this.displayError(error);
          }}
      )
  }

  getIngredients(searchText: string) {
    this.ingredients = [];
  const filter: IngredientFilter = {sortASC: true, sizePage: 10, status: true, sortBy: "",
   ingredientCategory: [], numPage: 0, searchText: searchText};
    this.ingredientService.getAll(filter)
      .pipe(takeUntil(this.destroy))
      .subscribe(
        {next: response => {
          for (let ingredient of response.content) {
            if(ingredient.id !== undefined && !(this.selectedIngredients.filter(i => i.id === ingredient.id).length > 0)) {
              this.ingredients.push({ name: ingredient.name, id: ingredient.id});
            }
          }
          },
          error: error => {
            this.displayError(error);
          }}
      )
  }

  filterIngredients(value: string): DishIngredientFilter[] {
    this.getIngredients(String(value));

    return this.ingredients;
  }

  removeIngredientFromList(ingredient: DishIngredientFilter): void {
    const ingredientIndex = this.selectedIngredients.indexOf(ingredient);
    const indexIdIndex = this.selectedIngredientsIds.indexOf(ingredient.id);
    if (ingredientIndex >= 0) {
      this.selectedIngredients.splice(ingredientIndex, 1);
    }
    if (indexIdIndex >= 0) {
      this.selectedIngredientsIds.splice(indexIdIndex, 1);
    }
  }

  onIngredientSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectedIngredients.push(event.option.value);
    this.selectedIngredientsIds.push(event.option.value.id);
    this.ingredientInput.nativeElement.value = '';
    this.ingredientControl.setValue(null);
  }

  // confirmDelete(id: string): void {
  //   const dialogRef = this.dialog.open(DeleteConfirmationComponent);
  //   dialogRef.afterClosed().subscribe(dialogResult => {
  //     if (dialogResult) {
  //       this.dishService.deleteDish(id)
  //     .pipe(takeUntil(this.destroy))
  //     .subscribe({
  //       next: () => {
  //         this.alertService.success("Dish deleted",true,true);
  //         this.getDishPage(this.currentPage, this.pageSize);
  //       },
  //       error: error => {
  //         this.displayError(error);
  //       }
  //     });
  //     }
  //   });
  // }

  manageFilterByStock(event: MatCheckboxChange) : void {
    this.isFilteredByStock = event.source.checked;
    this.changeSearchFormState();
    this.sortOrder = 'asc';
  }

  manageFilterByFavorite(event: MatCheckboxChange) : void {
    this.isFilteredByFavorite = event.source.checked;
    this.changeSearchFormState();
    this.sortOrder = 'asc';
  }

  changeSearchFormState() : void {
    if (this.isFilteredByStock || this.isFilteredByFavorite)
    {
      this.searchForm.controls['name'].reset({ value: '', disabled: true });
      this.searchForm.controls['categories'].reset({ value: '', disabled: true });
    }
    else {
      this.searchForm.controls['name'].reset({ value: '', disabled: false });
      this.searchForm.controls['categories'].reset({ value: '', disabled: false });
    }
  }

  manageDishLike(dish: Dish) : void {
    this.dishService.manageDishLike(dish.id!, !dish.isLiked)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: () => {
          dish.isLiked = !dish.isLiked;
          dish.isLiked ? dish.totalLikes!++ : dish.totalLikes!--;
        },
        error: error => {
          this.displayError(error);
        }
      });
  }

  manageFavoriteDish(dish: Dish) : void {
    this.dishService.manageFavoriteDish(dish.id!, !dish.isFavorite)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: () => {
          dish.isFavorite = !dish.isFavorite;
        },
        error: error => {
          this.displayError(error);
        }
      });
  }

  sortData(sortOrder: string) : void {
    sortOrder === 'desc' ? this.sortOrder = 'desc' : this.sortOrder = 'asc';
    this.getBySearch();
  }

  displayError(error: any) : void {
    switch (error.status) {
      case 400:
        this.alertMessage = "Something went wrong";
        break;
      case 404:
        this.alertMessage = error.error.message;
        break;
      default:
        this.alertMessage = "There was an error on the server, please try again later."
        break;
    }
    this.alertService.error(this.alertMessage,true,true);
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }
}

