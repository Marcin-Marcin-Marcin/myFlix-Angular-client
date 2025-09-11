import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-synopsis-dialog',
  templateUrl: './synopsis-dialog.component.html',
  styleUrls: ['./synopsis-dialog.component.scss']
})
/**
 * SynopsisDialogComponent
 *
 * Displays the synopsis of a selected movie in a dialog.
 * Receives data (title and description) via Angular Material's dialog injection.
 */
export class SynopsisDialogComponent {
  /**
   * @param data Injected dialog data containing movie title and description
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title: string; description: string }
  ) {}
}
