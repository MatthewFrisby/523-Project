import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SuperUser } from '@models/superUser.model';
import { Response } from '@models/response.model';
import { ResponseA } from '@models/responseA.model';
import { SAQEnum } from '@models/saqEnum.enum';



@Injectable({ providedIn: 'root' })
export class SAQService  {

    private router: Router;


  constructor(private http: HttpClient) { }

 //private _url: string = "https://security-n-compliance.herokuapp.com/api"
 private _url: string = "http://localhost:3000/api";

private getFromLocal(){
  return localStorage.getItem("_id");
}


 getSAQ(saqType: String): Observable<ResponseA>{
   return this.http.get<ResponseA>(this._url+"/SAQ/"+this.getFromLocal()+"/getsaq/"+saqType);
 }

submitSAQ(template: String, saqform: any): Observable<Response>{
  return this.http.post<Response>(this._url+"/SAQ/"+this.getFromLocal()+'/completesaq/'+template, {answers: saqform} );
}

saveSAQ(template: String, saqform: any): Observable<Response>{
  return this.http.post<Response>(this._url+"/SAQ/"+this.getFromLocal()+'/completesaq/'+template, {answers: saqform, action: "save"} );
}

getKeys(template: String): Observable<Response>{
  return this.http.get<Response>(this._url+"/SAQ/"+this.getFromLocal()+'/getkeys/'+template);
}


getCCW(): Observable<Response>{
  return this.http.get<Response>(this._url+"/SAQ/"+this.getFromLocal()+'/getccw');
}

submitCCW(ccw: any[], id: string): Observable<Response>{
  return this.http.post<Response>(this._url+"/SAQ/"+this.getFromLocal()+'/submitccw', {_id: id, data: ccw});
}

ccwURL(){
  return this._url+"/SAQ/"+this.getFromLocal()+'/downloadccw';
}

getForm(key: String): Observable<ArrayBuffer>{

//   const httpOptions = {
//   headers: new HttpHeaders({
//    'Content-Type': 'application/json'
//   })
// };

    return this.http.post(this._url+'/SAQ/getform',  {key: key}, { responseType: 'arraybuffer' });
}


}
