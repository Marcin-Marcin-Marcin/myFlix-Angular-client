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
/**
 * MovieCardComponent
 *
 * Displays a list of movies fetched from the API.
 * Allows users to view details (genre, director, synopsis)
 * and manage their list of favorite movies.
 */
export class MovieCardComponent implements OnInit {
  /** All movies fetched from the API */
  movies: any[] = [];

  /** Logged-in username (used for managing favorites) */
  private username: string | null = null;

  /** Set of favorite movie IDs for the current user */
  private favIds = new Set<string>();

  constructor(
    public fetchApiData: FetchApiDataService,
    private dialog: MatDialog,
    private snack: MatSnackBar
  ) {}

  /** Angular lifecycle hook. Initializes favorites and loads movies. */
  ngOnInit(): void {
    this.hydrateUserFavorites();
    this.getMovies();
  }

  /**
   * Loads user data from local storage and initializes favorite movies.
   * @private
   */
  private hydrateUserFavorites(): void {
    const stored = localStorage.getItem('user');
    if (!stored) { this.username = null; this.favIds.clear(); return; }
    try {
      const user = JSON.parse(stored);
      this.username = user?.Username || null;
      const favs: any[] = user?.FavoriteMovies || [];
      this.favIds = toIdSet(favs);
    } catch {
      this.username = null;
      this.favIds.clear();
    }
  }

  /**
   * Fetches all movies from the API and stores them locally.
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any[]) => {
      this.movies = resp || [];
    });
  }

  /**
   * Opens a dialog displaying genre details.
   * @param name Genre name
   */
  openGenre(name?: string): void {
    if (!name) { return; }
    this.dialog.open(GenreDialogComponent, { width: '420px', data: { name } });
  }

  /**
   * Opens a dialog displaying director details.
   * @param name Director name
   */
  openDirector(name?: string): void {
    if (!name) { return; }
    this.dialog.open(DirectorDialogComponent, { width: '520px', data: { name } });
  }

  /**
   * Opens a dialog displaying the movie synopsis.
   * @param title Movie title
   * @param description Movie description
   */
  openSynopsis(title: string, description: string): void {
    this.dialog.open(SynopsisDialogComponent, { width: '520px', data: { title, description } });
  }

  /**
   * Checks whether a movie is in the user's favorites.
   * @param movieId Movie ID
   * @returns true if the movie is a favorite, false otherwise
   */
  isFavorite(movieId: string): boolean {
    return this.favIds.has(String(movieId));
  }

  /**
   * Toggles a movie in the user's list of favorites.
   * Calls the API to update favorites and refreshes local storage.
   * @param movieId Movie ID
   */
  toggleFavorite(movieId: string): void {
    if (!this.username) {
      this.snack.open('Please log in first', 'OK', { duration: 2000 });
      return;
    }

    if (this.isFavorite(movieId)) {
      this.fetchApiData.removeFavoriteMovie(this.username, movieId).subscribe({
        next: (updatedUser) => {
          localStorage.setItem('user', JSON.stringify(updatedUser));
          this.favIds = toIdSet(updatedUser?.FavoriteMovies || []);
          this.snack.open('Removed from favorites', 'OK', { duration: 1500 });
        },
        error: () => this.snack.open('Could not remove favorite', 'OK', { duration: 2000 })
      });
    } else {
      this.fetchApiData.addFavoriteMovie(this.username, movieId).subscribe({
        next: (updatedUser) => {
          localStorage.setItem('user', JSON.stringify(updatedUser));
          this.favIds = toIdSet(updatedUser?.FavoriteMovies || []);
          this.snack.open('Added to favorites', 'OK', { duration: 1500 });
        },
        error: () => this.snack.open('Could not add to favorites', 'OK', { duration: 2000 })
      });
    }
  }
}

/**
 * Utility function to normalize an array of IDs or objects into a Set of strings.
 * @param arr Array of IDs, strings, or objects with `_id`/`id`
 * @returns Set of string IDs
 */
function toIdSet(arr: any[]): Set<string> {
  const ids = (arr || []).map((x: any) => {
    if (!x) return null;
    if (typeof x === 'string') return x;
    if (typeof x === 'object') return String(x._id || x.id || x);
    return String(x);
  }).filter(Boolean);
  return new Set(ids as string[]);
}
