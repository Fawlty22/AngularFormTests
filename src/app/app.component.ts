import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { ValidationError } from 'yup';
import { Subscription } from 'rxjs';

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
export class AppComponent implements OnInit, OnDestroy {
  title = 'test-app';
  interests = ['Reading', 'Sports', 'Travel', 'Music'];
  genderOptions = ['Male', 'Female', 'Other'];
  yupErrors: { [key: string]: string } = {};
  form: FormGroup;
  formSub: Subscription;

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
  ngOnInit(): void {
    this.formSub = this.form.valueChanges.subscribe((newValue) => {
      this.validateForm(newValue);
      console.log(newValue)
    });
  }
  ngOnDestroy(): void {
    this.formSub.unsubscribe();
  }
  async onSubmit() {
    await this.validateForm(this.form.value)
  }
  async validateForm(formData: any) {

    try {
      // Validate the form data
      await validationSchema.validate(formData, { abortEarly: false });
      // If validation is successful, return an empty object (no errors)
      return {};
    } catch (err: any) {
      if (err instanceof ValidationError) {
        // Map errors to a result object with field names and associated messages
        const errors: { [key: string]: string } = {};
        err.inner.forEach((error:any) => {
          errors[error.path!] = error.message;
        });
  
        console.log(errors)
        this.yupErrors = errors;
      }
      // Handle any other errors here
      return { general: 'An unexpected error occurred' };
    }
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

  getFormControlErrors(controlName: string): string {
    return this.yupErrors[controlName]
  }
}
