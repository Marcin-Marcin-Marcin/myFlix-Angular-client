import { Component, OnInit, Input } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';

import { FetchApiDataService } from '../fetch-api-data.service';

import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss']
})
/**
 * UserRegistrationFormComponent
 *
 * Provides a form for new users to register.
 * Communicates with the API service to create a new user
 * and shows feedback using Angular Material dialogs and snackbars.
 */
export class UserRegistrationFormComponent implements OnInit {
  /**
   * Data model for the registration form.
   * Includes username, password, email, and birthday.
   */
  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar
  ) {}

  /** Angular lifecycle hook. Called after component initialization. */
  ngOnInit(): void {}

  /**
   * Registers a new user by sending the form data to the API.
   * Closes the dialog on success and shows a snackbar message.
   */
  registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe(
      (result) => {
        this.dialogRef.close();
        this.snackBar.open(result, 'OK', {
          duration: 2000
        });
      },
      (result) => {
        this.snackBar.open(result, 'OK', {
          duration: 2000
        });
      }
    );
  }
}
