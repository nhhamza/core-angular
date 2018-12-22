import { catchError } from 'rxjs/operators';
import { AlertifyService } from './../_services/alertify.service';
import { UserService } from './../_services/user.service';
import { Injectable } from "@angular/core";
import { User } from "../_models/user";
import { Resolve, ActivatedRouteSnapshot, Router } from "@angular/router";
import { Observable, of } from 'rxjs';


@Injectable()
export class MemberDetailResolver implements Resolve<User> {
    constructor(private userService: UserService, 
        private router: Router, 
        private alerty: AlertifyService) {

    }
    resolve(route: ActivatedRouteSnapshot): Observable<User> {
        return this.userService.getUser(route.params['id']).pipe(
            catchError(error => {
                this.alerty.error('Problem retriving data');
                this.router.navigate(['/members']);
                return of(null);
            })
        )
    }
}