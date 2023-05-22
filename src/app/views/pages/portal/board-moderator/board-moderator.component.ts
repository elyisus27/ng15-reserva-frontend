import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../_services/user.service';

@Component({
  selector: 'app-board-moderator',
  templateUrl: './board-moderator.component.html',
  styleUrls: ['./board-moderator.component.css']
})
export class BoardModeratorComponent implements OnInit {
  content?: string;
  
  columns: any[] = [];
	buttons: any[] = [];
	actions: any[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.columns = [
      {
        name: 'cashClientCompanyId',
        title: 'PORTAL.COMPANY.FIELDS.ID',
        width: 80,
      },
              {
                  name: 'rfc',
                  title: 'PORTAL.COMPANY.FIELDS.RFC',
                  width: 120
              },
      {
        name: 'businessName',
        title: 'PORTAL.COMPANY.FIELDS.NAME',
        width: 200,
      },
    ];

    this.buttons = [{
      text: 'PORTAL.COMPANY.NEW_BUTTON',
      tooltip: 'GENERICS.ACTIONS.CREATE',
      icon: 'fa fa-plus',
      fn: () => {
        //this.create();
      }
    }];



    this.userService.getModeratorBoard().subscribe({
      
      next: data => {

        this.content = data;
      },
      error: err => {
        if (err.error) {
          try {
            const res = JSON.parse(err.error);
            this.content = res.message;
          } catch {
            this.content = `Error with status: ${err.status} - ${err.statusText}`;
          }
        } else {
          this.content = `Error with status: ${err.status}`;
        }
      }
    });
  }
}
