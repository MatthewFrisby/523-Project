import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { UserService } from '@services/user.service';
import { AuthenticationService } from '@services/auth.service';
@Component({
  selector: 'password-root',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css'],
  providers: [UserService],
})
export class Password implements OnInit {
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private auth: AuthenticationService
  ) { }
  submitted = false;
  notMatch = false;
  passwordForm: FormGroup;
  /*
  On load, component generates form for changing password
  */
  ngOnInit() {
    this.passwordForm = this.formBuilder.group({
      password: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      passConf: ['', [Validators.required, Validators.minLength(8)]]
    });
  }
  /*
  On form submissionm checks form validators, checks if new password and new password confirmation match,
  then will call our backend to update the password
  */
  onSubmit() {
    this.submitted = true;
    if (!this.confirmPassword(this.passwordForm)) {
      this.notMatch = true;
      return;
    } if (this.passwordForm.invalid) {
      return;
    }
    var oldPass = this.passwordForm.controls.password.value;
    var newPass = this.passwordForm.controls.newPassword.value;
    this.userService.changePassword(oldPass, newPass).subscribe(data => { console.log(data) });
  }
  /*
  simple get for form values
  */
  get form() { return this.passwordForm.controls };
  /*
  checks if the user inputs for the new password and the new password confirmation match
  */
  confirmPassword(form: FormGroup) {
    let password = form.controls.newPassword.value;
    let passConf = form.controls.passConf.value;
    if (password == passConf) {
      return true;
    }
    else {
      return false;
    }
  }
}
