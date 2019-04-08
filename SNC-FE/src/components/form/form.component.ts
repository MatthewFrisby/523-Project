import { Component, OnInit } from '@angular/core';
import { SAQService } from '@services/saq.service';
import { AuthenticationService } from '@services/auth.service';
import { SAQEnum } from '@models/saqEnum.enum';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';







@Component({
  selector: 'app-saq',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  providers: [SAQService],
})
export class Form implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private saq: SAQService,
    private formBuilder: FormBuilder,
  ) { }
  loaded: boolean;
  type:string;
  saqForm: FormGroup;
  enum = SAQEnum;
  questions: any[];
  ngOnInit() {
    this.type = this.route.snapshot.paramMap.get('type');

    this.loaded = false;

    this.saq.getSAQ(this.getEnum(this.type)).subscribe(data => {
    this.questions = data.data,
      this.buildForm()
    });
  }

 getEnum(type: String){
   if(type == "a"){
     return this.enum.A;
   }
   else if(type == "aep"){
     return this.enum.AEP;
   }else if(type == "b"){
     return this.enum.B;
   }else if(type == "bip"){
     return this.enum.BIP;
   }else if(type == "c"){
     return this.enum.C;
   }else if(type == "cvt"){
     return this.enum.CVT;
   }else if(type == "p2pe"){
     return this.enum.PPE;
   }else if(type == "d_merchant"){
     return this.enum.DMERCHANT;
   }else if(type == "d_service"){
     return this.enum.DSERVICE;
   }
 }

  buildForm() {
    let group = {};
    for (let i = 0; i < this.questions.length; i++) {
      group[`${this.questions[i]._id}`] = '';
    }
    this.saqForm = this.formBuilder.group(group);
    console.log(this.saqForm);
    this.loaded = true;
  }

  onSubmit() {
    console.log(this.saqForm.value);
    this.saq.submitSAQ(this.getEnum(this.type), this.saqForm.value).subscribe(data=>{console.log(data)});

  }

}
