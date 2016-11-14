import { Component, Input }             from '@angular/core';
import { OnInit }                       from '@angular/core';
import { User }                         from '../../../../models/user';
import { AlertMessage }                 from '../../../../models/alertMessage';
import { UserService }                  from '../../../../services/user/user.service';

@Component({
    selector: 'cc-users-lists-all',
    templateUrl: 'view.html',
    styleUrls: ['style.css'],
})

export class UsersListsAllComponent implements OnInit {
    @Input() alerts: AlertMessage[];
    working: boolean = false;
    users : User[];
    constructor(private userService: UserService) { }
    deleteUser(user: User) {
        this.userService.delete(user._id)
            .subscribe(
                () =>    { this.alerts.push({ type: 'success', message: 'User removed.' }) },
                (err) => { this.alerts.push({ type: 'error', message: err}) },
                () =>    { this.working = false; }
            );
    }
    ngOnInit() {
        this.working = true;
        this.userService.readAll()
            .subscribe(
                users => { 
                    this.users = users;
                    this.working = false;
                },
                err => this.alerts.push({ type: 'error', message: err })
            );
    }
};
