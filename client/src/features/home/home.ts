import { Component, inject, Input, input, signal } from '@angular/core';
import { Register } from '../account/register/register';
import { User } from '../../types/user';
import { AccountService } from '../../core/services/account-service';

@Component({
  selector: 'app-home',
  imports: [Register],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  protected registerMode = signal(false);
  protected accountService = inject(AccountService);
  showForgotPassword = false;

  showRegister(value: boolean){
    this.registerMode.set(value);
  }

  openForgotPassword() {
    this.showForgotPassword = true;
  }

  closeForgotPassword() {
    this.showForgotPassword = false;
  }
}
