import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FetchApiDataService } from '../../fetch-api-data.service';

@Component({
  selector: 'app-director-dialog',
  templateUrl: './director-dialog.component.html',
  styleUrls: ['./director-dialog.component.scss']
})
export class DirectorDialogComponent implements OnInit {
  director: any = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { name: string },
    private api: FetchApiDataService
  ) {}

  ngOnInit(): void {
    if (this.data?.name) {
      this.api.getDirector(this.data.name).subscribe(d => this.director = d);
    }
  }
}
