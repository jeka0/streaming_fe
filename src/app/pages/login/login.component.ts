import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
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
      error: (err) => {this.formGroup.controls['login'].setErrors({'login': true}); this.formGroup.controls['password'].setErrors({'login': true})},
    });
  }

  change(){
    if(this.formGroup.controls['password'].hasError('required') || this.formGroup.controls['login'].hasError('required')) return;
    this.formGroup.controls['password'].setErrors(null);
    this.formGroup.controls['login'].setErrors(null);
  }

  ngOnInit(): void {}
}
