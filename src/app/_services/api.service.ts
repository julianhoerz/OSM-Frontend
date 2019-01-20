import { Injectable } from '@angular/core';

import { Headers, Http } from '@angular/http';
//import 'rxjs/add/operator/toPromise';
import { Observable, of , throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
//import {APIService} from './api.service';
import {Table} from './../_models/table';

import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class ApiService {

    myurl: string = "http://localhost:3000";

    constructor(
       //private http: Http,
        private http: HttpClient)
        //private APIService: APIService
    {}

    getTable(): Promise<string> {
        console.log("Verbindungsversuch....");

        return this.http.get<string>("https://jsonplaceholder.typicode.com/todos/1").toPromise();
    }


    getRoute(coords: string): Promise<string> {
        console.log("Link: " + this.myurl+'/dijkstra/'+ coords);
        return this.http.get<string>(this.myurl+'/dijkstra/'+ coords).toPromise();
    }

    private handleError(error: HttpErrorResponse) {
        console.log("Error......");
        if (error.error instanceof ErrorEvent) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', error.error.message);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          console.error(
            `Backend returned code ${error.status}, ` +
            `body was: ${error.error}`);
        }
        // return an observable with a user-facing error message
        return throwError(
          'Something bad happened; please try again later.');
      };
}