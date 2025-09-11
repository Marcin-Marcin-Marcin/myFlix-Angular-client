import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
/**
 * UserProfileComponent
 *
 * Displays and updates the logged-in user's profile.
 * Allows editing profile details and shows the user's list of favorite movies.
 */
export class UserProfileComponent implements OnInit {
  /** Currently logged-in user object */
  user: any = null;

  /** Form data model for updating user profile */
  formData = {
    Username: '',
    Password: '',
    Email: '',
    Birthday: ''
  };

  /** All movies retrieved from the API */
  allMovies: any[] = [];

  /** IDs of the user's favorite movies */
  favoriteIds = new Set<string>();

  /** Favorite movies resolved from the full movie list */
  favoriteMovies: any[] = [];

  constructor(
    private api: FetchApiDataService,
    private snack: MatSnackBar
  ) {}

  /**
   * Angular lifecycle hook.
   * Loads stored user data, fetches all movies, and resolves favorite movies.
   */
  ngOnInit(): void {
    const stored = localStorage.getItem('user');
    if (stored) {
      this.user = JSON.parse(stored);
      this.formData.Username = this.user.Username || '';
      this.formData.Email = this.user.Email || '';
      this.formData.Birthday = this.user.Birthday ? this.user.Birthday.slice(0,10) : '';
      this.favoriteIds = toIdSet(this.user.FavoriteMovies || []);
    }

    this.api.getAllMovies().subscribe((movies: any[]) => {
      this.allMovies = movies || [];
      this.favoriteMovies = this.allMovies.filter(m => this.favoriteIds.has(String(m._id || m.id)));
    });
  }

  /**
   * Saves updated profile information.
   * Calls the API to update the user, refreshes stored data,
   * and reloads favorite movies.
   */
  save(): void {
    if (!this.user?.Username) { return; }
    const username = this.user.Username;
    const payload: any = {
      Username: this.formData.Username,
      Email: this.formData.Email,
      Birthday: this.formData.Birthday
    };
    if (this.formData.Password) { payload.Password = this.formData.Password; }

    this.api.editUser(username, payload).subscribe({
      next: () => {
        this.snack.open('Profile updated', 'OK', { duration: 2000 });
        this.api.getUser(payload.Username || username).subscribe(u => {
          localStorage.setItem('user', JSON.stringify(u));
          this.user = u;
          this.favoriteIds = toIdSet(u.FavoriteMovies || []);
          this.favoriteMovies = this.allMovies.filter(m => this.favoriteIds.has(String(m._id || m.id)));
        });
      },
      error: (err) => {
        this.snack.open('Update failed', 'OK', { duration: 3000 });
        console.error(err);
      }
    });
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
