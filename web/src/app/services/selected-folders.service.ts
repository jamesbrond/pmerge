import { Injectable } from '@angular/core';
import { PMergeFile } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class SelectedFoldersService {
  selectedFolders: PMergeFile[] = [];

  select(folder: PMergeFile) {
    this.selectedFolders.push(folder);
  }

  unselect(folder: PMergeFile) {
    this.selectedFolders = this.selectedFolders.filter((x) => x !== folder);
  }
}
