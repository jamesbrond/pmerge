import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faFolder, faFolderOpen, faFile, faTrash } from '@fortawesome/free-solid-svg-icons';
import { PMergeFile } from '../../interfaces';
import { CallApiService, SelectedFoldersService } from '../../services';

@Component({
  selector: 'pmerge-folder',
  templateUrl: './folder.component.html',
  styleUrls: []
})
export class FolderComponent implements OnInit {

  @Input() folders?: PMergeFile[];
  @Output() preview = new EventEmitter<PMergeFile>();

  icon_trash = faTrash;

  constructor(private api: CallApiService, private selected: SelectedFoldersService) { }

  ngOnInit(): void {
  }

  icon(folder: PMergeFile) {
    if (folder.is_dir) {
      return folder.is_open ? faFolderOpen : faFolder
    }
    return faFile;
  }

  expand(folder: PMergeFile) {
    if (!folder.is_dir) {
      this.preview.emit(folder);
      return;
    }
    if (folder.is_open) {
      folder.children = undefined;
    } else {
      this.api.files(folder.path).subscribe((x) => folder.children = x);
    }
    folder.is_open = !folder.is_open;
  }

  delete(folder: PMergeFile) {
    if (confirm(`Are you sure you want to delete ${folder.path}?`)) {
      this.api.delete([folder.path]);
      this.folders = this.folders?.filter((x) => x !== folder);
    }
  }

  select(e: any, folder: PMergeFile) {
    if (e.target.checked) {
      this.selected.select(folder);
    } else {
      this.selected.unselect(folder);
    }
  }

  previewChange(preview:PMergeFile) {
    this.preview.emit(preview);
  }
}
