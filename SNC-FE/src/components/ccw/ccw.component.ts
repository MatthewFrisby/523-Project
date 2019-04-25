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
  view = false;
  saqForm: FormGroup;
  ccwForm: FormGroup;
  enum = SAQEnum;
  questions: any[];
  keys = [];
  ccwURL = this.saq.ccwURL();
  headers = ["Constraints", "Objective", "Identified Risk", "Compensating Controls", "Testing of Controls", "Maintenance of Controls"];

  ngOnInit() {


    this.loaded = false;

    this.saq.getCCW().subscribe(data => {


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

      console.log(this.questions),
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
        //  for (let j = 0; j < this.headers.length; j++) {
        //console.log(`${this.questions[i].question._id}_${this.headers[j]}`);
        //group[`${this.questions[i].question._id}_${this.headers[j]}`] =  this.questions[i].ccw.response;
        if(this.questions[i].ccw[0] == null){
          group[`${this.questions[i].question._id}_${this.headers[0]}`] =  "";
          group[`${this.questions[i].question._id}_${this.headers[1]}`] =  "";
          group[`${this.questions[i].question._id}_${this.headers[2]}`] =  "";
          group[`${this.questions[i].question._id}_${this.headers[3]}`] =  "";
          group[`${this.questions[i].question._id}_${this.headers[4]}`] =  "";
          group[`${this.questions[i].question._id}_${this.headers[5]}`] =  "";

        }else{
          group[`${this.questions[i].question._id}_${this.headers[0]}`] = this.questions[i].ccw[0].response || "";
          group[`${this.questions[i].question._id}_${this.headers[1]}`] = this.questions[i].ccw[1].response || "";
          group[`${this.questions[i].question._id}_${this.headers[2]}`] = this.questions[i].ccw[2].response || "";
          group[`${this.questions[i].question._id}_${this.headers[3]}`] = this.questions[i].ccw[3].response || "";
          group[`${this.questions[i].question._id}_${this.headers[4]}`] = this.questions[i].ccw[4].response || "";
          group[`${this.questions[i].question._id}_${this.headers[5]}`] = this.questions[i].ccw[5].response || "";

        }
      //}
      }
    }

    this.ccwForm = this.formBuilder.group(group);
    console.log(this.ccwForm);
    this.loaded = true;
  }

  onSubmit() {
  console.log(this.ccwForm);
    let currentQuestion = ""
    let array = [];
    let group = {};
    Object.keys(this.ccwForm.controls).forEach(key => {


      if (key.split("_")[0] == currentQuestion) {
        group[`${key.split("_")[1]}`] = this.ccwForm.controls[key].value || "";

      }
      else{
          if(currentQuestion !== ""){
            array.push(group);
        }

          currentQuestion = key.split("_")[0];

        group = {};
      group[`Requirement`] = key.split("_")[0];
      group[`Constraints`] = this.ccwForm.controls[key].value || "";
      }

    });
    array.push(group);


    let temparray = [];
    for(let i = 0; i < array.length; i++){
      Object.keys(array[i]).forEach(key => {
        temparray.push({header: key, response: array[i][key]})
    });

    this.saq.submitCCW(temparray, temparray[0].response).subscribe(data=>{this.view = true; this.router.navigate(['../'], { relativeTo: this.route })});

    temparray=[];
  };



  }

}
