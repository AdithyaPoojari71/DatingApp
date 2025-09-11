import { Injectable, inject } from '@angular/core';
import { AccountService } from './account-service';
import { of, take, tap } from 'rxjs';
import { LikesService } from './likes-service';

@Injectable({
  providedIn: 'root'
})
export class InitService {
  private accountService = inject(AccountService);
  private likesService = inject(LikesService);
  init() {
    
    return this.accountService.refreshToken().pipe(
      tap(user =>{
        if(user){
          this.accountService.setCurrentUser(user);
          this.accountService.startTokenRefreshInterval();
        }
      })
    )
    
  }
}
