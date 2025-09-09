import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user: any = null;

  formData = {
    Username: '',
    Password: '',
    Email: '',
    Birthday: ''
  };

  constructor(
    private api: FetchApiDataService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    const stored = localStorage.getItem('user');
    if (stored) {
      this.user = JSON.parse(stored);
      this.formData.Username = this.user.Username || '';
      this.formData.Email = this.user.Email || '';
      this.formData.Birthday = this.user.Birthday ? this.user.Birthday.slice(0,10) : '';
    }
  }

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
      next: (res) => {
        this.snack.open('Profile updated', 'OK', { duration: 2000 });
        this.api.getUser(payload.Username || username).subscribe(u => {
          localStorage.setItem('user', JSON.stringify(u));
          this.user = u;
        });
      },
      error: (err) => {
        this.snack.open('Update failed', 'OK', { duration: 3000 });
        console.error(err);
      }
    });
  }
}
