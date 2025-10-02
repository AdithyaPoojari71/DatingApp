import { Component, EventEmitter, inject, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AccountService } from '../../../core/services/account-service';
import { MessageService } from '../../../core/services/message-service';
import { Router } from '@angular/router';
import { ToastService } from '../../../core/services/toast-service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  protected messageService = inject(MessageService);
  protected router = inject(Router);
  private toast = inject(ToastService);
  loginForm: FormGroup;
  isSubmitting = false;
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  @Output() close = new EventEmitter<void>();

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isSubmitting = true;
    const credentials = this.loginForm.value;

    this.accountService.login(credentials).subscribe({
      next: () => {
        this.router.navigateByUrl('/members');
        this.messageService.getUnreadMsgCount();
        this.toast.success('Logged in sucessfully');
        this.close.emit();
      },
      error: (error) => {
        this.toast.error(error.error);
      },
      complete: () => {
        this.isSubmitting = false;
        this.loginForm.reset();
      },
    });
  }

  openForgotPassword() {
    // open your forgot-password modal here
  }
}
