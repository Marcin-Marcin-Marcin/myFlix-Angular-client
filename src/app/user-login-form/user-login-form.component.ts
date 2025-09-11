import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss']
})
/**
 * UserLoginFormComponent
 *
 * Provides a login form for existing users.
 * Handles authentication by calling the API,
 * stores credentials in local storage, and navigates to the movie list.
 */
export class UserLoginFormComponent {
  /** Data model for login form */
  credentials = { Username: '', Password: '' };

  constructor(
    public api: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  /**
   * Logs the user in using provided credentials.
   * Stores user and token in local storage, closes the dialog,
   * shows a confirmation message, and navigates to the movie list.
   */
  login(): void {
    this.api.userLogin(this.credentials).subscribe(
      (res: any) => {
        // Expecting { safetyUser: {...}, token: '...' }
        localStorage.setItem('user', JSON.stringify(res.safetyUser));
        localStorage.setItem('token', res.token);
        this.dialogRef.close();
        this.snackBar.open('Logged in!', 'OK', { duration: 2000 });

        // Route to movies
        this.router.navigate(['movies']);
      },
      (err) => {
        this.snackBar.open(err?.error || 'Login failed', 'OK', { duration: 3000 });
      }
    );
  }
}
