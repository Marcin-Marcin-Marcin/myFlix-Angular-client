import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/internal/operators';

const apiUrl = 'https://mymyflixapp-46a281636c8c.herokuapp.com/';

@Injectable({
  providedIn: 'root'
})
/**
 * Service for communicating with the myFlix API.
 * Provides methods for user authentication, profile management,
 * and retrieving movie data.
 */
export class FetchApiDataService {
  constructor(private http: HttpClient) {}

  /**
   * Registers a new user.
   * @param userDetails User information for registration
   */
  public userRegistration(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Logs in a user.
   * @param credentials Username and password
   */
  public userLogin(credentials: any): Observable<any> {
    return this.http.post(apiUrl + 'login', credentials).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves a user by username.
   * @param username Username of the user
   */
  public getUser(username: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/' + username, {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + token })
    }).pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Updates a user's details.
   * @param username Username of the user
   * @param update Object containing updated fields
   */
  public editUser(username: string, update: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put(apiUrl + 'users/' + username, update, {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + token })
    }).pipe(catchError(this.handleError));
  }

  /**
   * Deletes a user account.
   * @param username Username of the user
   */
  public deleteUser(username: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + 'users/' + username, {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + token })
    }).pipe(catchError(this.handleError));
  }

  /**
   * Retrieves all movies.
   */
  public getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies', {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + token })
    }).pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Retrieves a single movie by title.
   * @param title Title of the movie
   */
  public getMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/' + title, {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + token })
    }).pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Retrieves information about a director.
   * @param name Director's name
   */
  public getDirector(name: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/directors/' + name, {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + token })
    }).pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Retrieves information about a genre.
   * @param name Genre name
   */
  public getGenre(name: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/genres/' + name, {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + token })
    }).pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Retrieves a user's list of favorite movies.
   * @param username Username of the user
   */
  public getFavoriteMovies(username: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/' + username + '/movies', {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + token })
    }).pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Adds a movie to a user's favorites.
   * @param username Username of the user
   * @param movieId ID of the movie
   */
  public addFavoriteMovie(username: string, movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(apiUrl + 'users/' + username + '/movies/' + movieId, {}, {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + token })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Removes a movie from a user's favorites.
   * @param username Username of the user
   * @param movieId ID of the movie
   */
  public removeFavoriteMovie(username: string, movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + 'users/' + username + '/movies/' + movieId, {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + token })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Extracts response data.
   * @param res API response
   * @returns Response body
   */
  private extractResponseData(res: Response): any {
    const body = res;
    return body || {};
  }

  /**
   * Handles API errors.
   * @param error HTTP error response
   * @returns Error message
   */
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(`Error Status code ${error.status}, Error body is: ${error.error}`);
    }
    return throwError('Something bad happened; please try again later.');
  }
}
