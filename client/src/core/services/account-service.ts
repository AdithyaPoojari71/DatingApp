import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { LoginCreds, User } from '../../types/user';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LikesService } from './likes-service';
import { PresenceSerive } from './presence-serive';
import { HubConnectionState } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  private likesService = inject(LikesService);
  private presenceService = inject(PresenceSerive);
  currentUser = signal<User | null>(null);

  private baseurl = environment.apiUrl;
  
  register(creds:LoginCreds){
    return this.http.post<User>(this.baseurl + 'account/register',creds, {withCredentials: true}).pipe(
      tap(user => {
        if(user){
          this.setCurrentUser(user);
          this.startTokenRefreshInterval();
        }
      })
    )
  }

  login(creds:LoginCreds){
    return this.http.post<User>(this.baseurl + 'account/login',creds, {withCredentials: true}).pipe(
      tap(user => {
        if(user){
          this.setCurrentUser(user);
          this.startTokenRefreshInterval();
        }
      })
    )
  }

  refreshToken(){
    return this.http.post<User>(this.baseurl + 'account/refresh-token',{},{withCredentials: true})
  }

  startTokenRefreshInterval(){
    setInterval(() =>{
      this.http.post<User>(this.baseurl + 'account/refresh-token',{},{withCredentials: true}).subscribe({
        next: user =>{
          this.setCurrentUser(user)
        },
        error:() =>{
          this.logout();
        }
      })
    },  5 * 60 * 1000)
  }
  
  setCurrentUser(user:User){
    user.roles = this.getRolesFromToken(user);
    this.currentUser.set(user);
    this.likesService.getLikeIds();
    if(this.presenceService.hubConnection?.state !== HubConnectionState.Connected){
      this.presenceService.createHubConnection(user);
    }
  }

  logout(){
     this.http.post(this.baseurl + 'account/logout', {}, { withCredentials: true }).subscribe({
      next: () => {
        localStorage.removeItem('filters');
        this.likesService.clearLikeIds();
        this.currentUser.set(null);
        this.presenceService.stopHubConnection();
      }
    })
  }

   private getRolesFromToken(user: User): string[] {
    const payload = user.token.split('.')[1];
    const decoded = atob(payload);
    const jsonPayload = JSON.parse(decoded);
    return Array.isArray(jsonPayload.role) ? jsonPayload.role : [jsonPayload.role]
  }

}
