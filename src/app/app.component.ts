import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
/**
 * Root component of the Angular application.
 * Handles user session state and provides logout functionality.
 */
export class AppComponent {
  /** Application title */
  title = 'myFlix-Angular-client';

  constructor(private router: Router) {}

  /**
   * Indicates if the user is logged in.
   * @returns true if a token exists in local storage, false otherwise
   */
  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  /**
   * Retrieves the username of the logged-in user.
   * @returns Username string, or null if not available
   */
  get username(): string | null {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user).Username : null;
    } catch {
      return null;
    }
  }

  /**
   * Logs the user out by clearing local storage
   * and redirecting to the welcome page.
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/welcome']);
  }
}
