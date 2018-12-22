import { AlertifyService } from './../_services/alertify.service';
import { AuthService } from './../_services/auth.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  model: any = {};
  registerForm: FormGroup;
  
  constructor(private authService: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.registerForm = new FormGroup({
      userName: new FormControl(),
      password: new FormControl(),
      confirmPassword: new FormControl()
    });
  }

  register() {
    // this.authService.register(this.model).subscribe(() => {
    //   this.alertify.success("register OK");
    // }, error =>  this.alertify.error(error));
    console.log(this.registerForm.value);
  }
  cancel() {
    this.cancelRegister.emit(false);
  }
}
