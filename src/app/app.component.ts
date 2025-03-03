import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterOutlet } from '@angular/router';
import {MatCheckbox } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { validationSchema } from './yup/form.schema';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatRadioModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatCheckbox,
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'test-app';
  interests = ['Reading', 'Sports', 'Travel', 'Music'];
  genderOptions = ['Male', 'Female', 'Other'];
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      newsletter: [false,Validators.requiredTrue],
      gender: ['', Validators.required],
      interests: [[], Validators.required],
    });
  }
  onSubmit() {
    console.log(this.form.value);
  }
  getFormControls() {
    return Object.keys(this.form.controls).map(key => {
      const control = this.form.get(key);
      return {
        label: this.capitalizeFirstLetter(key),
        value: control?.value,
        dirty: control?.dirty,
        pristine: control?.pristine,
        touched: control?.touched,
        untouched: control?.untouched,
        valid: control?.valid,
        invalid: control?.invalid,
        errors: control?.errors
      };
    });
  }

  private capitalizeFirstLetter(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  getFormControlErrors(controlName: string): string[] {
    const control = this.form.get(controlName);
    if (control && control.errors) {
      const errors = [];
      for (const errorKey in control.errors) {
        if (control.errors.hasOwnProperty(errorKey)) {
          if (errorKey === 'required') {
            errors.push(`${controlName} is required`);
          } else if (errorKey === 'minlength') {
            errors.push(`${controlName} must be at least 3 characters`);
          } else if (errorKey === 'pattern') {
            errors.push(`${controlName} should contain only letters`);
          } else if (errorKey === 'email') {
            errors.push(`Invalid Email`);
          }
          // Add other error conditions here as needed
        }
      }
      return errors;
    }
    return [];
  }
}
