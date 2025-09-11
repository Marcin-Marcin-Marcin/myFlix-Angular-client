import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FetchApiDataService } from '../../fetch-api-data.service';

@Component({
  selector: 'app-genre-dialog',
  templateUrl: './genre-dialog.component.html',
  styleUrls: ['./genre-dialog.component.scss']
})
/**
 * GenreDialogComponent
 *
 * Displays details of a movie genre in a dialog.
 * Fetches genre data from the API using the provided genre name.
 */
export class GenreDialogComponent implements OnInit {
  /** The genre object fetched from the API */
  genre: any = null;

  /**
   * @param data Injected dialog data containing the genre name
   * @param api Service used to fetch genre information from the backend
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { name: string },
    private api: FetchApiDataService
  ) {}

  /**
   * Angular lifecycle hook.
   * Fetches the genre information when the component initializes.
   */
  ngOnInit(): void {
    if (this.data?.name) {
      this.api.getGenre(this.data.name).subscribe(g => this.genre = g);
    }
  }
}
