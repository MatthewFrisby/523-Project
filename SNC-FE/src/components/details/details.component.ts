import { Component, OnInit } from '@angular/core';
import { SAQService } from '@services/saq.service';
import { AuthenticationService } from '@services/auth.service';
import { SAQEnum } from '@models/saqEnum.enum';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '@services/user.service';








@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  providers: [UserService],
})
export class Details implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private superuser: UserService,

  ) { }
  superinfo: any[];
  loaded: boolean;


  ngOnInit() {
    this.loaded=false;
    this.superuser.getSuper().subscribe(data => {this.superinfo = data.data,   this.loaded=true, console.log(this.superinfo)});

  }


}