import { AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { finalize, merge, ReplaySubject, takeUntil } from 'rxjs';
import { NewKitchenware } from 'src/app/_models';
import { SearchKitchenwareParams } from 'src/app/_models/search-kitchenware-params';
import { StandardSearchParams } from 'src/app/_models/standard-search-params';
import { TechniqueMitigation } from 'src/app/_models/technique-mitigation';
import { KitchenwareService } from 'src/app/_services/kitchenware.service';
import { TechniqueMitigationService } from 'src/app/_services/technique-mitigation.service';

@Component({
  selector: 'links-edit',
  templateUrl: './links-edit.component.html',
  styleUrls: ['./links-edit.component.scss']
})
export class LinksEditComponent implements AfterViewInit, OnDestroy {
  formFilter: FormGroup;
  columnsToDisplay = ['name', 'description', 'actions'];
  links: TechniqueMitigation[] = [];
  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  isLoadingResults = true;
  resultsLength = 0;
  selectedLinks: TechniqueMitigation[] = [];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private dialogRef: MatDialogRef<LinksEditComponent>,
    private techniqueMitigationService: TechniqueMitigationService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: any) {
    this.selectedLinks = data.selectedLinks;
    this.formFilter = this.formBuilder.group({
      searchText: [],
      status: []
    });
  }

  ngAfterViewInit(): void {
    this.loadData();
    this.sort.sortChange.pipe(takeUntil(this.destroy)).subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page).pipe(takeUntil(this.destroy)).subscribe(() => this.loadData());
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

  OnSubmitFilter() {
    this.paginator.pageIndex = 0;
    this.loadData();
  }

  loadData() {
    const searchParams: StandardSearchParams = {
      name: this.searchText === null ? "" : this.searchText, order: this.sort.direction
    }
    this.isLoadingResults = true;
    this.techniqueMitigationService.getTechniqueList(this.paginator.pageIndex, searchParams,
      this.paginator.pageSize).pipe(takeUntil(this.destroy),
        finalize(() => this.isLoadingResults = false)).subscribe({
          next: data => {
            this.resultsLength = data.totalElements;
            this.links = data.content;
            const matTable = document.getElementById('table');
            if (matTable)
              matTable.scrollIntoView();
          },
          error: () => {
            this.links = [];
          }
        });
  }

  addLink(link: TechniqueMitigation) {
    this.selectedLinks.push(link);
  }

  cancelAddingLink(linkId: string) {
    this.selectedLinks = this.selectedLinks.filter(v => v.id !== linkId);
  }

  get filterControl() {
    return this.formFilter.controls;
  }

  get searchText() {
    return this.filterControl['searchText'].value;
  }

  checkSelectedLinks(id: string): boolean {
    return this.selectedLinks.some(link => link.id == id);
  }

  close(): void {
    this.dialogRef.close(this.selectedLinks);
  }

}
