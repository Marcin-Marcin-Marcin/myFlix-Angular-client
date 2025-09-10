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
export class UserLoginFormComponent {
  credentials = { Username: '', Password: '' };

  constructor(
    public api: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  login(): void {
    this.api.userLogin(this.credentials).subscribe(
      (res: any) => {
        // Expecting { user: {...}, token: '...' }
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
