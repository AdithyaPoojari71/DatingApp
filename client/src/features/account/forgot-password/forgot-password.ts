import { Component, EventEmitter, inject, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AccountService } from '../../../core/services/account-service';
import { ResetPassword } from '../../../types/user';
import { ToastService } from '../../../core/services/toast-service';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  forgotPasswordForm: FormGroup;
  private accountService = inject(AccountService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);
  isSubmitting = false;
  @Output() close = new EventEmitter<void>();

  constructor() {
    this.forgotPasswordForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(8),
          ],
        ],
        confirmNewPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(group: FormGroup) {
    const newPassword = group.get('newPassword')?.value;
    const confirmNewPassword = group.get('confirmNewPassword')?.value;
    return newPassword === confirmNewPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.forgotPasswordForm.invalid) return;

    this.isSubmitting = true;

    const forgotPassword: ResetPassword = {
      email: this.forgotPasswordForm.value.email,
      newPassword: this.forgotPasswordForm.value.newPassword,
      ConfirmPassword: this.forgotPasswordForm.value.confirmNewPassword,
    };

    this.accountService.forgotPassword(forgotPassword).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.forgotPasswordForm.reset();
        this.close.emit();
        this.toast.success('Password has been reset successfully.');
      },
      error: (err) => {
        this.isSubmitting = false;
        this.toast.error('Something went wrong. Try again later.');
      },
    });
  }
}
