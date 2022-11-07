import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CallApiService } from 'src/app/services';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';


@Component({
  selector: 'pmerge-duplicate-modal',
  templateUrl: './duplicate-modal.component.html',
  styleUrls: []
})
export class DuplicateModalComponent implements OnInit {

  @Input() duplicate: any;
  origSrc: string = '';
  dupSrc$: Observable<string>[] = [];

  icon_delete = faTrash;

  constructor(public activeModal: NgbActiveModal, private api: CallApiService) { }

  ngOnInit(): void {
    this.api.image(this.duplicate.location).subscribe((x) => this.origSrc = x);
    for (let dup of this.duplicate.duplicates) {
      this.dupSrc$.push(this.api.image(dup));
    }
  }

  delete(path: string) {
    if (confirm(`Are you sure you want to delete ${path}?`)) {
      this.api.delete([path]);
      this.activeModal.close(this.duplicate);
    }
  }

}
