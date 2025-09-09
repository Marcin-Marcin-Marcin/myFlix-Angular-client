import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FetchApiDataService } from '../../fetch-api-data.service';

@Component({
  selector: 'app-genre-dialog',
  templateUrl: './genre-dialog.component.html',
  styleUrls: ['./genre-dialog.component.scss']
})
export class GenreDialogComponent implements OnInit {
  genre: any = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { name: string },
    private api: FetchApiDataService
  ) {}

  ngOnInit(): void {
    if (this.data?.name) {
      this.api.getGenre(this.data.name).subscribe(g => this.genre = g);
    }
  }
}
