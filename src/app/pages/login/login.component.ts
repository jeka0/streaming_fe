import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  formGroup: FormGroup;
  showPassword: boolean;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private router: Router,
  ) {
    this.showPassword = false;
    this.formGroup = this.fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  login() {
    this.authService.login(this.formGroup.value).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: (err) => console.error(err),
    });
  }

  ngOnInit(): void {}
}
