import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';

import { Environment } from '../model/environment.model';
import { EnvironmentComponent } from '../views/environment/environment.component';
import { Reading } from '../model/reading.model';
import { Image } from '../model/Image.model';
import { AuthService } from './auth.service';
import { UrlResolver } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class BMSService {
  private ENDPOINT: String;

  constructor(private http: HttpClient, private auth: AuthService) { 
    this.ENDPOINT = '/api/';
  }

  public getEnvironments(): Observable<Environment[]> {
    return this.http.get<Environment[]>(this.ENDPOINT + 'environments')
  }

  public getEnvironment(id: Number): Observable<Environment> {
    return this.http.get<Environment>(this.ENDPOINT + 'environments/'+id);
  }

  public addEnvironment() {
    return this.http.post(this.ENDPOINT + 'environments',{});
  }

  public delEnvironment(id: Number) {
    return this.http.delete(this.ENDPOINT + 'environments/' + id)
  }

  public addSensor(id: number, name: string, desc: string) {
    return this.http.post(this.ENDPOINT + 'sensors', {
      env:id, name: name, desc: desc
    })
  }

  public getReading(id: Number, count:Number): Observable<Reading> {
    return this.http.get<Reading>(this.ENDPOINT + `Readings?sensors=${id}&Count=${count}`);
  }

  public getReadingsAsTable(ids: Number[], count: Number, page:Number = 0) {
    if (page == null) page = 0;
    let out = '';
    for (let i = 0; i < ids.length; i++) {
        out += ids[i]
        if (i != ids.length-1) {
            out += ',';
        } 
    }
    return this.http.get(this.ENDPOINT + `Readings?sensors=${out}&AsTable=1&Count=${count}&Page=${page}`);
  }

  /// Config stuff
  // Not using object modelling here, isn't needed
  public getConfiguration() {
    return this.http.get(this.ENDPOINT + 'Configuration');
  }

  public setConfiguration(table: String, data: any) {
    return this.http.patch(this.ENDPOINT + 'Configuration', {
      'table': table,
      'data': data
    });
  }

  public getImages(EnvironmentID: Number): Observable<Image[]> {
    return this.http.get<Image[]>(this.ENDPOINT + 'Images/Environment/' + EnvironmentID)
    .pipe(map(images => {
      return this.parseImages(images);
    }));
  }

  public getAllImages(): Observable<Image[]> {
    return this.http.get<Image[]>(this.ENDPOINT + 'Images')
    .pipe(map(images => {
      return this.parseImages(images);
    }));
  }

  public getUser(): Observable<any> {
    return this.http.get<any>(this.ENDPOINT + 'users/session')
  }

  public updateUser(updatedUser): Observable<any> {
    return this.http.patch<any>(this.ENDPOINT + 'users', updatedUser);
  }


  // Helper for appending our token to the image URL
  private parseImages(images: Image[]) : Image[] {
    images = images.map(image => {
      let link = new URL(image.link.toString(), location.toString());
      link.searchParams.append('token', this.auth.getToken());
      image.link = link.toString();
      return image;
    })
    return images;
  }
}
