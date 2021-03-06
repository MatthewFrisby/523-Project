import { Component, OnInit } from '@angular/core';
import { SAQService } from '@services/saq.service';
import { AuthenticationService } from '@services/auth.service';
import { SAQEnum } from '@models/saqEnum.enum';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '@services/user.service';
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  providers: [UserService],
})
export class Account implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private superuser: UserService
  ) { }
  superinfo: any[];
  loaded: boolean;
  subIDs: any[] = [];
  subs: any[] = [];
  /*
  On initial loading of page, component calls server and recieved superuser information to dispplay
  if the super user has no subusers it loads a different portion of our template to indicate that
  if the super user does have subusers it loads the subusers names
  */
  ngOnInit() {
    var temp = [];
    this.loaded = false;
    this.superuser.getSuper().subscribe(data => {
      this.superinfo = data.data; this.subIDs = data.data.subusers;
      if (this.subIDs.length == 0) {
        this.loaded = true;
      }
      else {
        for (let sub in this.subIDs) {
          this.superuser.getUser(this.subIDs[sub]).subscribe(data => {
            temp.push(data.data);
            if (Number(sub) == this.subIDs.length - 1) {
              this.subs = temp;
              console.log(this.subs);
              console.log(this.superinfo);
              this.loaded = true;
            }
          });
        };
      }
    });
  }
}
