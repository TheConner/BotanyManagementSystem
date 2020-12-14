import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements HttpInterceptor {
  //this.HEADERS=new HttpHeaders({
  //  "Token": Auth.getToken()
  //});
  constructor() { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authReq = req.clone({headers: req.headers.set("Token", this.getToken())});
    return next.handle(authReq).pipe(catchError(x=>this.handleAuthError(x)));
  }

  public handleAuthError(err: HttpErrorResponse) : Observable<any> {
    console.log("Auth Error");
    window.location.href = '/login';

    // Technically this will never be reached, but it must be here to appease typescript
    return of(err.message);
  }

  public isAuthenticated():boolean {
    // Check if token exists
    if (this.getToken()==null) {
      return false;
    } else {
      return true;
    }
  }

  public getToken():string {
    return localStorage.getItem('BMS-Auth');
  }
}
