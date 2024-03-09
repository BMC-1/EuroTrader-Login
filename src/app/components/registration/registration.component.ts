
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AuthService} from "../../auth.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  registrationForm: FormGroup;
  passwordStrength: number = 0;
  passwordStrengthText: string = 'Weak';
  loading = false; // Add loading indicator
  selectedRole: string = 'user'; // Default role is 'User'
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  passwordMismatch: boolean = false;

  constructor(private authService: AuthService, private formBuilder: FormBuilder) {
    this.registrationForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['user', Validators.required],
      password: [this.password, Validators.required],
      confirmPassword: [this.confirmPassword, Validators.required]
    });
  }

  registerUser() {
    this.loading = true;

    this.authService.register(this.registrationForm.value).subscribe(
      (response) => {
        console.log('Login successful', response);
        this.showSuccessMessage('Register Succeed','Thanks for registering to our platform');
      },
      (error) => {
        console.error('Login failed', error);
        this.showErrorAlert('Register Failed','Contact Support');
      }
    ).add(() => {
      this.loading = false;
    });
  }

  checkPasswordStrength(event: Event): void {
    const password = (event.target as HTMLInputElement).value;
    this.password = password;
    this.passwordStrength = 0;

    if (password.length >= 8) {
      this.passwordStrength += 1;
    }
    if (password.match(/[A-Z]/)) {
      this.passwordStrength += 1;
    }
    if (password.match(/[a-z]/)) {
      this.passwordStrength += 1;
    }
    if (password.match(/\d/)) {
      this.passwordStrength += 1;
    }
    if (password.match(/[$&+,:;=?@#|'<>.^*()%!-]/)) {
      this.passwordStrength += 1;
    }

    switch (this.passwordStrength) {
      case 0:
      case 1:
        this.passwordStrengthText = "Weak";
        break;
      case 2:
        this.passwordStrengthText = "Fair";
        break;
      case 3:
        this.passwordStrengthText = "Good";
        break;
      case 4:
        this.passwordStrengthText = "Strong";
        break;
      case 5:
        this.passwordStrengthText = "Very Strong";
        break;
    }
  }

  checkMissMatchPassword(event: Event):void {
    const confirmPassword = (event.target as HTMLInputElement).value;
    this.confirmPassword = confirmPassword;
    this.passwordMismatch = this.password !== confirmPassword;
  }

  togglePasswordVisibility(fieldId: string): void {
    if (fieldId === 'password') {
      this.showPassword = !this.showPassword;
    } else if (fieldId === 'confirmPassword') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
    const passwordInput = document.getElementById(fieldId) as HTMLInputElement;
    passwordInput.type = (fieldId === 'password' && this.showPassword) || (fieldId === 'confirmPassword' && this.showConfirmPassword) ? 'text' : 'password';
  }

  private showErrorAlert(title: string, text: string): void {
    Swal.fire({
      icon: 'error',
      title: title,
      text: text,
    });
  }

  private showSuccessMessage(title: string, text: string): void {
    Swal.fire({
      icon: 'success',
      title: title,
      text: text,
    });
  }

  onSubmit(): void {
    // Mark all form controls as touched
    Object.keys(this.registrationForm.controls).forEach(controlName => {
      this.registrationForm.get(controlName)?.markAsTouched();
    });

    // Check if the form is valid
    if (this.registrationForm?.valid) {
      // Check if there are any errors
      const firstNameErrors = this.registrationForm.get('firstName')?.errors;
      const lastNameErrors = this.registrationForm.get('lastName')?.errors;
      const emailErrors = this.registrationForm.get('email')?.errors;

      // If any error is present, display appropriate message
      if (firstNameErrors) {
        console.log('Invalid first name:', firstNameErrors);
        return; // Stop further execution
      }
      if (lastNameErrors) {
        console.log('Invalid last name:', lastNameErrors);
        return; // Stop further execution
      }
      if (emailErrors) {
        console.log('Invalid email:', emailErrors);
        return; // Stop further execution
      }

      // Proceed with registration logic
      this.passwordMismatch = this.password !== this.confirmPassword;
      if (!this.passwordMismatch) {
        this.registerUser();
        // Handle form submission logic here
        console.log('Registration successful');
        console.log('username:', this.registrationForm?.get('username')?.value);
        console.log('Email:', this.registrationForm?.get('email')?.value);
        console.log('Password:', this.registrationForm?.get('password')?.value);
        console.log('Role:', this.registrationForm?.get('role')?.value);
      }
    }
  }
}
