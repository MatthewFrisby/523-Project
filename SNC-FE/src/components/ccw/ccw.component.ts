import { Component, OnInit } from '@angular/core';
import { SAQService } from '@services/saq.service';
import { AuthenticationService } from '@services/auth.service';
import { SAQEnum } from '@models/saqEnum.enum';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-ccw',
  templateUrl: './ccw.component.html',
  styleUrls: ['./ccw.component.css'],
  providers: [SAQService],
})
export class Ccw implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private saq: SAQService,
    private formBuilder: FormBuilder,
  ) { }
  loaded: boolean;
  type: string;
  saqForm: FormGroup;
  ccwForm: FormGroup;
  enum = SAQEnum;
  questions: any[];
  keys = [];
  headers = ["Requirement", "Constraints", "Objective", "Identified Risk", "Compensating Controls", "Testing of Controls", "Maintence of Controls"];

  ngOnInit() {
    this.type = "a";//this.route.snapshot.paramMap.get('type');

    this.loaded = false;

    this.saq.getSAQ(this.getEnum(this.type)).subscribe(data => {

      this.questions = data.data.sort((n1, n2) => {
        var first = n1.question._id.split(".");
        var second = n2.question._id.split(".");
        var len = Math.max(first.length, second.length);


        for (var i = 0; i < len; i++) {

          if (isNaN(first[i]) && isNaN(second[i])) {
            if (first[i] > second[i]) {
              return 1;
            }
            else if (first[i] < second[i]) {
              return -1;
            }
          }
          else if (isNaN(first[i]) && !isNaN(second[i])) {
            return -1;
          }
          else if (!isNaN(first[i]) && isNaN(second[i])) {
            return 1;
          }
          else {
            if (Number(first[i]) > Number(second[i])) {
              return 1;
            }
            if (Number(first[i]) < Number(second[i])) {
              return -1;
            }

          }


        }


        return 0;
      });

      console.log(data),
        //  this.questions = data.data,
        this.buildCCWForm()
    });
  }

  getEnum(type: String) {
    if (type == "a") {
      return this.enum.A;
    }
    else if (type == "aep") {
      return this.enum.AEP;
    } else if (type == "b") {
      return this.enum.B;
    } else if (type == "bip") {
      return this.enum.BIP;
    } else if (type == "c") {
      return this.enum.C;
    } else if (type == "cvt") {
      return this.enum.CVT;
    } else if (type == "p2pe") {
      return this.enum.PPE;
    } else if (type == "d_merchant") {
      return this.enum.DMERCHANT;
    } else if (type == "d_service") {
      return this.enum.DSERVICE;
    }
  }



  buildCCWForm() {
    let group = {};
        for (let i = 0; i < this.questions.length; i++) {
          if (this.questions[i].answer == "Yes with CCW") {
            for (let j = 0; j < this.headers.length; j++) {
              //console.log(`${this.questions[i].question._id}_${this.headers[j]}`);
              group[`${this.questions[i].question._id}_${this.headers[j]}`] =  this.questions[i].ccw.response;
        }
        }
      }

  this.ccwForm = this.formBuilder.group(group);
  console.log(this.ccwForm);
  this.loaded=true;
}

onSubmit() {
  this.keys=[];
for (let key in this.saqForm.value) {
  if(this.saqForm.value[key]=="Yes with CCW"){
      this.keys.push(key);
  }
};
  this.saq.submitSAQ(this.getEnum(this.type), this.saqForm.value).subscribe(data => { console.log(data), this.router.navigate(['../'], { relativeTo: this.route }); });
}

onSave() {
  this.keys=[];
for (let key in this.saqForm.value) {
  if(this.saqForm.value[key]=="Yes with CCW"){
      this.keys.push(key);
  }
};

  this.saq.saveSAQ(this.getEnum(this.type), this.saqForm.value).subscribe(data => { console.log(data), this.router.navigate(['../'], { relativeTo: this.route }); });
}

}