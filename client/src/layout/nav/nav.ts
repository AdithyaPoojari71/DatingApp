import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastService } from '../../core/services/toast-service';
import { themes } from '../them';
import { BusyService } from '../../core/services/busy-service';
import { HasRole } from '../../shared/directives/has-role';

@Component({
  selector: 'app-nav',
  imports: [FormsModule,RouterLink,RouterLinkActive,HasRole],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav implements OnInit{
  protected accountService = inject(AccountService);
  protected busyService = inject(BusyService);
  protected router = inject(Router);
  private toast = inject(ToastService);
  protected creds: any = {}
  protected selectedTheme = signal<string>(localStorage.getItem('theme') || 'light');
  protected themes = themes;
  protected loading = signal(false);
  ngOnInit(): void {
    document.documentElement.setAttribute('data-theme',this.selectedTheme());
  }


  handleSelectTheme(theme: string){
    this.selectedTheme.set(theme);
    localStorage.setItem('them',theme);
    document.documentElement.setAttribute('data-theme',theme);
    const ele = document.activeElement as HTMLDivElement;
    if(ele) ele.blur();
  }

  handleSelectUserItem(){
    const ele = document.activeElement as HTMLDivElement;
    if(ele) ele.blur();
  }


  login(){
    this.loading.set(true);
    this.accountService.login(this.creds).subscribe({
      next: () => {
        this.router.navigateByUrl('/members');
        this.toast.success("Logged in sucessfully");
        this.creds = {};
      },
      error: error => {
        console.log(error)
        this.toast.error(error.error);
      },
      complete: () => this.loading.set(false)
    })
  }

  logout(){
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}
