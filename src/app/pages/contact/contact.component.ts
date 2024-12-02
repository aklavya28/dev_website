import { Component, OnInit } from '@angular/core';
import { HeaderTitleComponent } from '../../layout/header/header-title/header-title.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPhoneSquare,faEnvelope, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { AbstractControl, FormBuilder, FormGroup,  ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
// import {MatFormFieldControl, MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ApiService } from '../../api.service';
import Swal from 'sweetalert2'
import '@sweetalert2/theme-borderless/borderless.css';



@Component({
  selector: 'app-contact',
  imports: [HeaderTitleComponent,
    FontAwesomeModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,

  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {
  faPhoneSquare = faPhoneSquare;
  faEnvelope = faEnvelope;
  faBuilding = faBuilding;
  contactForm!: FormGroup
  constructor( private fb:FormBuilder, private api: ApiService){}
  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: this.fb.control('', [Validators.required]),
      mobile_number: this.fb.control('', [Validators.required, this.only_digit(), Validators.maxLength(10), Validators.minLength(10)]),
      email: this.fb.control('', [Validators.required, Validators.email]),
      message: this.fb.control('', [Validators.required, Validators.maxLength(200)]),

    })
  }
  only_digit(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      // const panRegex = /^-?(0|[1-9]\d*)?$/;
      const panRegex = /^([1-9]\d*|0\.\d*[1-9]\d*|[1-9]\d*\.\d+)$/;
      const valid = panRegex.test(control.value);
      return valid ? null : { invalidDigit: true };
    }
  }
  submit(){

    let data = this.contactForm.value
    console.log(data)
    this.api.save_contact(data).subscribe((res:any) =>{
      Swal.fire({
        icon:"success",
        text: "Request submitted successfully"
      });
      this.contactForm.reset();
      this.contactForm.markAsPristine(); // Remove 'dirty' state
      this.contactForm.markAsUntouched(); // Remove 'touched' state

    }, (err) =>{
      Swal.fire({
        icon: "error",
        text: "Somthing want worng, Data not saved"
      });
    })
  }

}
