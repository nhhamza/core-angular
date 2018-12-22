import { AuthService } from './../../_services/auth.service';
import { UserService } from './../../_services/user.service';
import { User } from 'src/app/_models/user';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
@ViewChild('editForm') editForm: NgForm;
user: User;
photoUrl; string ;

@HostListener('window:beforeunload', ['$event'])
unloadNotification($event: any){
  if (this.editForm.dirty) {
    $event.returnValue = true;
  }
}
  constructor(private route: ActivatedRoute, private alertyfy: AlertifyService,
          private userService: UserService, private authService: AuthService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
    });
    this.authService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
  }

  updateUser() {
      this.userService.updateUser(this.authService.decodedToken.nameid, this.user).subscribe(
        next => {
          this.alertyfy.success("update profile successfully");
          this.editForm.reset(this.user);
        }, error => {
          this.alertyfy.error( error);
        }
      );
  }
  updateMainPhoto(photoUrl) {
    this.user.photoUrl = photoUrl;
  }
}
