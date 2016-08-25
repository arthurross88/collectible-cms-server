import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

@Component({
    selector: 'password-reset',
    templateUrl: 'app/components/password-reset/password-reset.html',
    styleUrls: ['app/components/password-reset/password-reset.css'],
    directives: []
})

export class PasswordReset implements OnInit {
    title: string;
    upn: string;
    password1: string = "";
    password2: string = "";
    key: string = "";
    requestSuccess: boolean;
    resetSuccess: boolean;
    working: boolean = false;
    constructor(private http: Http) {
        this.title = 'Password Reset';
    }
    requestReset() {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        this.working = true;
        var self = this;
        this.http.post('/api/public/account/reset', '{ Upn: "' + this.upn + '" }', { headers: headers }).subscribe((res: Response) =>
            function () {
                self.working = false;
                var result = res.json();
                if (result.Status.Success) {
                    self.requestSuccess = true;
                } else {
                    self.requestSuccess = false;
                }
            }()
        );
    }
    reset() {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        this.working = true;
        var self = this;
        this.http.post('/api/public/account/reset', '{ Upn: "' + this.upn + '", Key: "' + this.key + '", Password: "' + this.password1 + '" }', { headers: headers }).subscribe((res: Response) =>
            function () {
                self.working = false;
                var result = res.json();
                if (result.Status.Success) {
                    self.resetSuccess = true;
                } else {
                    self.resetSuccess = false;
                }
            } ()
        );
    }
    ngOnInit() {
    }
};
