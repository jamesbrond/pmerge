import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { PreviewComponent } from './components';
import { Duplicate, PMergeFile } from './interfaces';
import { CallApiService, SelectedFoldersService, ToasterService } from './services';
import { DuplicateModalComponent } from './components/duplicate-modal/duplicate-modal.component';


@Component({
  selector: 'pmerge-root',
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent implements OnInit, OnDestroy {
  roots: PMergeFile[] = [];
  output: string = '';

  mergeOutput: string = "";
  duplicatesList: Duplicate[] = [];

  icon_show = faEye;

  form = new FormGroup({
    target: new FormControl(this.selected.selectedFolders[0]?.name || '', Validators.required)
  })

  s: Subscription[] = [];

  constructor(private api: CallApiService, private toaster: ToasterService, public selected: SelectedFoldersService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.s.push(this.api.roots().subscribe((x) => this.roots = x));
    this.s.push(this.api.output().subscribe((x) => this.output = x));
  }

  ngOnDestroy(): void {
    this.s.forEach((x) => x?.unsubscribe());
  }

  get target() {
    return this.form.get("target");
  }

  previewChange(file: PMergeFile) {
    this.s.push(this.api.image(file.path).subscribe((x) => {
      if (x) {
        const modalRef = this.modalService.open(PreviewComponent);
        modalRef.componentInstance.file = file;
        modalRef.componentInstance.src = x;
      }
    }));
  }

  merge() {
    if (this.form.valid) {
      const inputs = this.selected.selectedFolders;
      const output = this.output + "/" + this.target?.value;
      this.s.push(this.api.merge(inputs, output).subscribe((x) => {
        this.mergeOutput = x;
        this.s.push(this.api.duplicates(output).subscribe((z) => this.duplicatesList = z));
      }));
    }
  }

  duplicates() {
    if (this.form.valid) {
      const output = this.output + "/" + this.target?.value;
      this.s.push(this.api.duplicates(output).subscribe((z) => this.duplicatesList = z));
    }
  }

  compare(duplicate: any) {
    const modalRef = this.modalService.open(DuplicateModalComponent, { size: 'xl' });
    modalRef.componentInstance.duplicate = duplicate;
    modalRef.closed.subscribe((x:any) => {
      if (x.filename) {
        this.duplicates();
      }
    });
  }
}
