import { AlertifyService } from "src/app/_services/alertify.service";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "./../_services/auth.service";
import { Pagination, PaginationResult } from "./../_models/pagination";
import { UserService } from "./../_services/user.service";
import { Component, OnInit } from "@angular/core";
import { User } from "../_models/user";

@Component({
  selector: "app-lists",
  templateUrl: "./lists.component.html",
  styleUrls: ["./lists.component.css"]
})
export class ListsComponent implements OnInit {
  users: User[];
  pagination: Pagination;
  likesParam: string;
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private route: ActivatedRoute,
    private alerty: AlertifyService
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.users = data["users"].result;
      this.pagination = data["users"].pagination;
    });
    this.likesParam = "Likers";
  }
  pagedChanged(event: any) {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }

  loadUsers() {
    this.userService
      .getUsers(
        this.pagination.currentPage,
        this.pagination.itemsPerPage,
        null,
        this.likesParam
      )
      .subscribe((res: PaginationResult<User[]>) => {
        this.users = res.result;
        this.pagination = res.pagination;
      });
  }
}
