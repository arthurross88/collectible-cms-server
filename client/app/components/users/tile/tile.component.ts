import { Component, Input, Output, ViewChild, OnInit, EventEmitter } from '@angular/core';
import { DomSanitizationService } from '@angular/platform-browser';
import { File } from '../../../models/file';
import { User } from '../../../models/user';
import { AlertMessage } from '../../../models/alertMessage';
import { FileService } from '../../../services/file/file.service';

/**
 *  <cc-users-tile
 *      [user]="user" 
 *      [options]="tileOptions"
 *      (onAlert)="doOnAlert($event)">
 *  </cc-users-tile>
 */
@Component({
    moduleId: module.id,
    selector: 'cc-users-tile',
    templateUrl: 'tile.html',
    styleUrls: ['tile.css'],
    providers: [
        FileService
    ],
    directives: [
    ]
})
export class UsersTile implements OnInit {
    @Input() user: User;
    @Input() options: Options;
    @Output() onAlert = new EventEmitter<AlertMessage>();
    working: boolean = false;
    loaded: boolean = false;
    file: File;
    constructor(private fileService: FileService, private sanitizer: DomSanitizationService) { }
    ngOnInit() { }
    ngOnChanges(changes: Map<string, any>): void {
        if (changes['user'] !== undefined && changes['user'].currentValue !== undefined) {
            if (this.user.imageId !== undefined){
                this.working = true;
                this.fileService.read(this.user.imageId).subscribe(
                    file => { this.file = file; this.loaded = true; },
                    err => { this.onAlert.emit({ type: 'error', message: err }) },
                    () => { this.working = false; }
                );
            }
        }
    }
    getStyle() {
        // return this.sanitizer.bypassSecurityTrustStyle(
        //     'width:' + this.options.width + ';' + 
        //     'height:' + this.options.height + ';'
        // );
    }    
    // Event listener for child component.
    doOnAlert(alert: AlertMessage) {
        this.onAlert.emit(alert);
    }
};

export class Options {

}