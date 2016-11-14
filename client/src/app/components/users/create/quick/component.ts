import { Component }     from '@angular/core';
import { OnInit }        from '@angular/core';
import { Input }         from '@angular/core';
import { User }          from '../../../../models/user';
import { AlertMessage }  from '../../../../models/alertMessage';
import { UserService }   from '../../../../services/user/user.service';

@Component({
    selector: 'cc-users-create-quick',
    templateUrl: 'view.html',
    styleUrls: ['style.css'],
})

export class UsersCreateQuickComponent implements OnInit {
    @Input() alerts: AlertMessage[]
    working: boolean = true;
	email: string;
	password: string;
    user: User = null;
    constructor(private userService: UserService) { }
    create() {
        this.working = true;
        let user: User = new User();
        user.email = this.email;
        user.password = this.password;
    	this.userService.create(user)
	    .subscribe(
			user => {
                this.user = user;
                this.alerts.push({ type: 'success', message: 'User created' });
            },
		    err => this.alerts.push({ type: 'error', message: err }),
		    () => this.working = false
		)
    }
    ngOnInit() {
    }
};
