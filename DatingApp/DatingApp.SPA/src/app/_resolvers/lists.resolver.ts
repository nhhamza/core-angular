import { AuthService } from "./../_services/auth.service";
import { catchError } from "rxjs/operators";
import { AlertifyService } from "./../_services/alertify.service";
import { UserService } from "./../_services/user.service";
import { Injectable } from "@angular/core";
import { User } from "../_models/user";
import { Resolve, ActivatedRouteSnapshot, Router } from "@angular/router";
import { Observable, of } from "rxjs";

@Injectable()
export class ListsResolver implements Resolve<User[]> {
  pageNumber = 1;
  pageSize = 5;
  likesPram = "Likers";

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private alerty: AlertifyService
  ) {}
  resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
    return this.userService.getUsers(this.pageNumber, this.pageSize, null, this.likesPram).pipe(
      catchError(error => {
        this.alerty.error("problem retrieving data");
        this.router.navigate(["/home"]);
        return of(null);
      })
    );
  }
}
