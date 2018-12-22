import { AuthService } from './../_services/auth.service';
import { catchError } from 'rxjs/operators';
import { AlertifyService } from './../_services/alertify.service';
import { UserService } from './../_services/user.service';
import { Injectable } from "@angular/core";
import { User } from "../_models/user";
import { Resolve, ActivatedRouteSnapshot, Router } from "@angular/router";
import { Observable, of } from 'rxjs';


@Injectable()
export class MemberEditResolver implements Resolve<User> {
    constructor(private userService: UserService, private authService: AuthService,
        private router: Router, 
        private alerty: AlertifyService) {

    }
    resolve(route: ActivatedRouteSnapshot): Observable<User> {
        return this.userService.getUser(this.authService.decodedToken.nameid).pipe(
            catchError(error => {
                this.router.navigate(['/members']);

                this.alerty.error('Problem retriving your data');
                return of(null);
            })
        )
    }
}