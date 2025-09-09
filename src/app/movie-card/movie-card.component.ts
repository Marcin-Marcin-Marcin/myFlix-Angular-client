import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FetchApiDataService } from '../fetch-api-data.service';
import { GenreDialogComponent } from '../dialogs/genre-dialog/genre-dialog.component';
import { DirectorDialogComponent } from '../dialogs/director-dialog/director-dialog.component';
import { SynopsisDialogComponent } from '../dialogs/synopsis-dialog/synopsis-dialog.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    private dialog: MatDialog,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any[]) => {
      this.movies = resp || [];
      console.log(this.movies);
    });
  }

  openGenre(name?: string): void {
    if (!name) { return; }
    this.dialog.open(GenreDialogComponent, {
      width: '420px',
      data: { name }
    });
  }

  openDirector(name?: string): void {
    if (!name) { return; }
    this.dialog.open(DirectorDialogComponent, {
      width: '520px',
      data: { name }
    });
  }

  openSynopsis(title: string, description: string): void {
    this.dialog.open(SynopsisDialogComponent, {
      width: '520px',
      data: { title, description }
    });
  }

  addToFavorites(movieId: string): void {
    const stored = localStorage.getItem('user');
    const user = stored ? JSON.parse(stored) : null;
    const username = user?.Username;

    if (!username) {
      this.snack.open('Please log in first', 'OK', { duration: 2000 });
      return;
    }

    this.fetchApiData.addFavoriteMovie(username, movieId).subscribe({
      next: () => this.snack.open('Added to favorites', 'OK', { duration: 1500 }),
      error: () => this.snack.open('Could not add to favorites', 'OK', { duration: 2000 })
    });
  }
}
