import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PMergeFile } from 'src/app/interfaces';

@Component({
  selector: 'pmerge-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent {
  @Input() file?: PMergeFile;
  @Input() src: string = '';

  constructor(public activeModal: NgbActiveModal) {}
}
