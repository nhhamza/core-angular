import { NgxGalleryModule, NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { AlertifyService } from "./../../_services/alertify.service";
import { UserService } from "./../../_services/user.service";
import { User } from "src/app/_models/user";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-member-detail",
  templateUrl: "./member-detail.component.html",
  styleUrls: ["./member-detail.component.css"]
})
export class MemberDetailComponent implements OnInit {
  user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(
    private userService: UserService,
    private alerty: AlertifyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // this.route.data.subscribe(data => {
    //   this.user = data['user'];
    // });
     this.loadUser();

    this.galleryOptions = [{
      width: '500px',
      height: '500px',
      imagePercent: 100,
      thumbnailsColumns: 4,
      imageAnimation: NgxGalleryAnimation.Slide,
      preview: false,
    }];
    
   
  }



  getImage() {
    if (!this.user.photos) {
      return;
    }
    const imageUrls = [];
    for (let i = 0; i < this.user.photos.length; i++) {
      imageUrls.push({
        small: this.user.photos[i].url,
        medium: this.user.photos[i].url,
        big: this.user.photos[i].url,
        description: this.user.photos[i].description
      }) ;
    }
    return imageUrls;
  }
  
  loadUser() {
    this.userService
      .getUser(+this.route.snapshot.params["id"])
      .subscribe((user: User) => (this.setUserData(user))),
      error => {
        this.alerty.error(error);
      };
  }
  setUserData(user){
    this.user = user;
    this.galleryImages = this.getImage();
  }
}
