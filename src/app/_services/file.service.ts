import { Injectable } from '@angular/core';

import { Headers, Http } from '@angular/http';
//import {APIService} from './api.service';




@Injectable()
export class FileService {

    myurl: String = "";

    constructor(
        private http: Http
        //private APIService: APIService
    ){
        //this.myurl = APIService.getURL();
    }

    getData(file): Promise<string> {

        return new Promise((resolve, reject) => {
            var fr = new FileReader();  
            fr.onload = () => {
            resolve(fr.result+"")
            };
            fr.readAsText(file.blob);
        });
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        
        return Promise.reject(error.message || error);
    }

}