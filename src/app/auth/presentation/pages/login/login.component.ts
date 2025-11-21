import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
  ],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginComponent {
  private _formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  hidePassword = true;
  loginForm: FormGroup = this._formBuilder.group({
    login: ['', Validators.required],
    password: ['', Validators.required],
    remember: [false],
  });

  ngOnInit(): void {
    this.getSavedLogin()
  }

  login() {
    if (this.loginForm.invalid) return;
    this.authService.login(this.loginForm.value).subscribe(() => {
      this.router.navigateByUrl('/home');
    });
  }

  private getSavedLogin() {
    const loginSaved = localStorage.getItem('login');
    if (!loginSaved) return;
    this.loginForm.patchValue({ login: loginSaved, remember: true });
  }
}
