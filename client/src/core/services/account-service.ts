import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { LoginCreds, User } from '../../types/user';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  currentUser = signal<User | null>(null);

  baseurl = 'https://localhost:5001/api/';
  
  register(creds:LoginCreds){
    return this.http.post<User>(this.baseurl + 'account/register',creds).pipe(
      tap(user => {
        if(user){
          this.setCurrentUser(user);
        }
      })
    )
  }

  login(creds:LoginCreds){
    return this.http.post<User>(this.baseurl + 'account/login',creds).pipe(
      tap(user => {
        if(user){
          this.setCurrentUser(user);
        }
      })
    )
  }

  setCurrentUser(user:User){
    localStorage.setItem('user',JSON.stringify(user));
    this.currentUser.set(user);
  }

  logout(){
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }
}
