import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import Swal from 'sweetalert2';
import { IUserDto } from "../../interfaces/IUserDto";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  userDto: IUserDto = { username: '', password: '' }; // Initialize the user DTO
  loading = false;
  showPassword = false;

  constructor(private authService: AuthService) {}

  login() {
    this.loading = true;

    this.authService.login(this.userDto).subscribe(
      (response) => {
        console.log('Login successful', response);
        this.showSuccessMessage('Login Succeed', 'Credits by Loizos :)');
      },
      (error) => {
        console.error('Login failed', error);
        this.showErrorAlert('Login Failed', 'Invalid username or password. Please try again.');
      }
    ).add(() => {
      this.loading = false;
    });
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

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
