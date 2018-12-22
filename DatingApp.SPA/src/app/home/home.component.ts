import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  registredMode = false;
  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  

  registerToggle() {
    this.registredMode = true;
  }

  cancelRegisterMode(registerMode: boolean) {
    this.registredMode = registerMode;
  }
}
