import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FetchApiDataService } from '../../fetch-api-data.service';

@Component({
  selector: 'app-director-dialog',
  templateUrl: './director-dialog.component.html',
  styleUrls: ['./director-dialog.component.scss']
})
/**
 * DirectorDialogComponent
 *
 * Displays details of a movie director in a dialog.
 * Fetches director data from the API using the provided name.
 */
export class DirectorDialogComponent implements OnInit {
  /** The director object fetched from the API */
  director: any = null;

  /**
   * @param data Injected dialog data containing the director name
   * @param api Service used to fetch director information from the backend
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { name: string },
    private api: FetchApiDataService
  ) {}

  /**
   * Angular lifecycle hook.
   * Fetches the director information when the component initializes.
   */
  ngOnInit(): void {
    if (this.data?.name) {
      this.api.getDirector(this.data.name).subscribe(d => this.director = d);
    }
  }
}
