import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  url = "https://app.devrising.in/" //save-contact
  constructor(
    private http: HttpClient
  ) { }
  save_contact(data:any): Observable<any>{
    let contentHeader = new HttpHeaders({ "Content-Type":"application/json"});
    return this.http.post<any>(this.url+'save-contact', {data}, {
      headers: contentHeader,
      observe: 'response'
     })

  }


}
