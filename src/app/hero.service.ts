import { Injectable } from '@angular/core';
import { Hero } from './hero';
//import { HEROES } from './mock-heroes';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

const Options = {
  headers: new HttpHeaders({'Content-Type':'application/json'})
};



@Injectable()
export class HeroService {

  private heroesURL = 'api/heroes'; //URL to web api

  constructor(
    private http: HttpClient,
    private messageService : MessageService) { }

  getHeroes() : Observable<Hero[]>{
    this.messageService.add('HeroService: feched heroes');
    //Returning obserbable list of Heroes from WebApi
    return this.http.get<Hero[]>(this.heroesURL).pipe(
      tap(heroes => this.log(`fetched heroes`)),
      catchError(this.hadleError('getHeroes', []))
    ); 
  }
  getHero(id: number): Observable<Hero> {
    this.messageService.add(`HeroService: fetched hero id=${id}`);
    //return of(HEROES.find(hero => hero.id === id));
    const url = `${this.heroesURL}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id =${id}`)),
      catchError(this.hadleError<Hero>(`getHero id=${id}`))
    );
  }

  private log(message: String) {
     this.messageService.add('HeroService:' + message);
  }

  private hadleError<T> (operation = 'operation', result?: T){
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesURL, hero, Options).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.hadleError<any>('updateHero'))
    );
  }
}
