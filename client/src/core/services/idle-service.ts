import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, merge, Subscription, timer } from 'rxjs';
import { AccountService } from './account-service';

@Injectable({
  providedIn: 'root'
})
export class IdleService {
  private userActivityEvents: any;
  private timerSubscription?: Subscription;

  private readonly TIMEOUT = 5 * 60 * 1000; // 5 minute

  constructor(private router: Router, private ngZone: NgZone, private accountService: AccountService) {
    this.initListener();
    this.initTimer();
  }

  private initListener() {
    // Listen to user activity
    this.userActivityEvents = merge(
      fromEvent(window, 'mousemove'),
      fromEvent(window, 'mousedown'),
      fromEvent(window, 'keydown'),
      fromEvent(window, 'scroll'),
      fromEvent(window, 'touchstart')
    );

    this.userActivityEvents.subscribe(() => this.resetTimer());
  }

  private initTimer() {
    // Use NgZone.runOutsideAngular to avoid excessive change detection
    this.ngZone.runOutsideAngular(() => {
      this.startTimer();
    });
  }

  private startTimer() {
    this.timerSubscription?.unsubscribe();

    this.timerSubscription = timer(this.TIMEOUT).subscribe(() => {
      this.ngZone.run(() => this.logout());
    });
  }

  private resetTimer() {
    this.startTimer(); // restart the timer on user activity
  }

  private logout() {
    this.accountService.logout(); // Call your logout method
    this.router.navigateByUrl('/');
  }
}
