import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AdminsettingsService } from '../adminsettings.service';
import { DownloadExcelService } from '../../download-excel.service';
import * as XLSX from 'xlsx';
import { MatSnackBar, MatOptionSelectionChange } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-target',
  templateUrl: './target.component.html',
  styleUrls: ['./target.component.scss']
})
export class TargetComponent implements OnInit {

  @ViewChild('uploadModal') public uploadModal: ModalDirective;
  @ViewChild('downloadModal') public downloadModal: ModalDirective;

  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth() + 1;
  divisions: any = [];
  locations: any;
  entities: any;
  TargetTemplate: any = [];
  downloadData: any = [];
  datatemplate: any = [];
  targetfiltered: any;
  file: File;
  arrayBuffer: any;
  submittedfile: any[];
  uploadTemplate: any = [];
  finalTargetFile: any = [];
  targetValue: any;
  public filterQuery = "";
  totalYears:  any = [];
  filteredTargetValues: any;
  YearMonths: any = [];
  selectedYear: any;
  selectedMonth: any;
  selectedDivisionId: any;
  filterForm: any;

  constructor(private _adminsettingservice: AdminsettingsService,public fb: FormBuilder,public snackBar: MatSnackBar, private excelService: DownloadExcelService) { 

        this.filterForm = this.fb.group({
          'year': null,
          'month': [null],
          'division': [null],
          'country': [null],
          'entity': [null]
        });
  }

  ngOnInit() {
    this.getTargetTemplateKPI(0);
    this.getTargetValue()
  }

  resetForm(){
    this.filterForm.reset();
    this.getTargetValue()
  }
  
  onYearSelect(year){
    this.selectedYear = year;
    this._adminsettingservice.getTargetValue().subscribe(
      data => {
        this.targetValue = data['data']
        this.targetValue = this.targetValue.filter(x=> x.year==year) 
        this.YearMonths =[];
        this.targetValue.forEach(element => {
          this.YearMonths.push(element.month) 
          this.YearMonths = Array.from(new Set(this.YearMonths));
        }); 
      }
    )
  }

  onMonthSelect(month){
    this._adminsettingservice.getTargetValue().subscribe(
      data => {
        this.selectedMonth = month;
        this.targetValue = data['data']
        this.targetValue = this.targetValue.filter(x=> x.year==this.selectedYear && x.month == month)
        this.targetValue.forEach(element => {
          this.divisions = [];
        this.divisions.push({Name: element.divisionName, Id: element.divisionId}  ) 
        this.divisions = Array.from(new Set(this.divisions));
        }); 
      }
    )
  }

  onDivisionSelect(DivisionId){
    this._adminsettingservice.getTargetValue().subscribe(
      data => {
        this.selectedDivisionId = DivisionId;
        this.targetValue = data['data']
        this.targetValue = this.targetValue.filter(x=> x.year==this.selectedYear 
          && x.month == this.selectedMonth && x.divisionId == DivisionId)
        this.targetValue.forEach(element => {
          this.divisions.push(element.divisionName, element.divisionId) 
          this.divisions = Array.from(new Set(this.divisions));
        }); 
      }
    )
    console.log(this.divisions)

  }

  incomingfile(event) {
    this.file = event.target.files[0];
  }

  Upload() {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
      let submittedfile = XLSX.utils.sheet_to_json(worksheet, { raw: true })
      this.comparefiles(submittedfile);
    }
    fileReader.readAsArrayBuffer(this.file);
    this.getTargetValue();
    this.uploadModal.hide();
  }

  // comparefiles(submittedfile) {
  //   console.log(submittedfile, 'submitted file')

  //   this._adminsettingservice.getTargetTemplate().subscribe(
  //     data => {
  //       console.log(data['data'], "main data");
  //       console.log(this.currentMonth);
  //       this.uploadTemplate = data['data'];
  //       submittedfile.forEach(element => {
  //         for (var i = 0; i < this.uploadTemplate.length; i++) {
  //           if (this.uploadTemplate[i].KPITitle == element.KPITitle
  //             && this.uploadTemplate[i].DimensionTitle == element.DimensionTitle
  //             && this.uploadTemplate[i].KRATitle == element.KRATitle) {
  //             if (element['year'] != 0 && element['year'] >= this.currentYear) {

  //               if (element['month'] != 0 && element['month'] >= this.currentMonth && element['month'] < 12) {

  //                 if (element['target'] != null && element['target'] < 100) {
  //                   element['KPIId'] = this.uploadTemplate[i].KPIId;
  //                   element['entityId'] = 1;

  //                   console.log("zzzzzzzzzz");
  //                 }
  //                 else {
  //                   console.log('Error on Target')
  //                 }
  //               }
  //               else {
  //                 console.log('Error on Month')
  //               }
  //             }
  //             else {
  //               console.log('Error  on Year')
  //             }
  //           }
  //           else {
  //             console.log('Matching Error')
  //           }
  //         }
  //         // this.finalTargetFile.push(element)
  //       });
  //       // console.log(this.finalTargetFile)
  //       // this._adminsettingservice.upsertTarget(this.finalTargetFile).subscribe(
  //       //   data=>{
  //       //     console.log(data)
  //       //   },
  //       //   error=>{
  //       //     console.log(error)
  //       //   }
  //       // )
  //     });


  // }



  /*  testing */
  comparefiles(submittedfile) {
    console.log(submittedfile, 'submitted file');

    var testing = [];

    this._adminsettingservice.getTargetTemplate().subscribe(
      data => {
        console.log(data['data'], "main data");
        this.uploadTemplate = data['data'];

        submittedfile.forEach(element => {
          for (var i = 0; i < this.uploadTemplate.length; i++) {

            if (this.uploadTemplate[i].KPITitle == element.KPITitle && this.uploadTemplate[i].DimensionTitle == element.DimensionTitle && this.uploadTemplate[i].KRATitle == element.KRATitle) {

              if (element['year'] >= this.currentYear && element['month'] >= this.currentMonth && element['target'] <= 100 && element['target'] != null) {
                element['KPIId'] = this.uploadTemplate[i].KPIId;
                let sessionUser = JSON.parse(sessionStorage['Session_name'])
                element['createdBy'] = sessionUser["user_id"];
                element['modifiedBy'] = sessionUser["user_id"];
                element['entityId'] = 1;
                console.log(sessionUser["user_id"], "user_id")
                console.log(element, "zzzzzzzzzz");
                testing.push(element);
                break;
              }
            }
          }
          console.log("-----------------------")
          // this.finalTargetFile.push(element)
        });

        if (testing.length == this.uploadTemplate.length) {
          console.log("working")
        }
        else {
          console.log("Invalid")
        }


        /*  WRITE CODE TO SEND VALUES TO THE API  */

        this._adminsettingservice.upsertTarget(testing).subscribe(
          data => {
            console.log(data)
            this.getTargetValue()
          },
          error => {
            console.log(error)
          }
        )
      });
  }

  //To get all divisions for filter
  // getDivisions() {
  //   this._adminsettingservice.getDivisions().subscribe(
  //     data => {
  //       this.divisions = data['data']
  //     },
  //     error => {
  //       console.log(error)
  //     }
  //   )
  // }

  getTargetValue() {
    this._adminsettingservice.getTargetValue().subscribe(
      data => {
        this.targetValue = data['data']
        this.targetValue.forEach(element => {
          this.totalYears.push(element.year)
        });
        this.totalYears = Array.from(new Set(this.totalYears));
      }
    )
  }

  downloadExistingData(targetValue){
    console.log(targetValue)
    let data= []
    targetValue.forEach(element => {
      delete element['KPIId'];
      delete element['entityId'];
      delete element['targetId']
      delete element['targetValueId']
      delete element['createdBy'];
      delete element['createdDate'];
      delete element['modifiedBy'];
      delete element['modifiedDate'];
      data.push(element);
    });
    this.excelService.exportAsExcelFile(data, 'Data');
  }

  getTargetTemplateKPI(i: number) {
    this.downloadData = [];
    this._adminsettingservice.getTargetTemplate().subscribe(
      data => {
        this.TargetTemplate = data['data'];
        this.TargetTemplate.forEach(element => {
           delete element['KPIId'];
          delete element['entityId'];

          delete element['createdBy'];
          delete element['createdDate'];
          delete element['modifiedBy'];
          delete element['modifiedDate'];

           element['year'] = null;
          element['month'] = null;
          element['target'] = null;
          this.downloadData.push(element);
        });
        if (i != 0)
          this.exportAsXLSX(this.downloadData);
      },
      error => {
        console.log(error)
      }
    )
  }

  getLocations(divisionId) {
    this._adminsettingservice.getLocations(divisionId).subscribe(
      data => {
        this.locations = data['data']
      },
      error => {
        console.log(error)
      }
    )
  }

  getEntities(locationId) {
    this._adminsettingservice.getEntities(locationId).subscribe(
      data => {
        this.entities = data['data']
      },
      error => {
        console.log(error)
      }
    )
  }

  downloadModalToggle(e) {
    if (e == 1) {
      this.downloadModal.show();
    }
    else {
      this.downloadModal.hide();
    }
  }

  uploadModalToggle(e) {
    if (e == 1) {
      this.uploadModal.show();
    }
    else {
      this.uploadModal.hide();
    }
  }

  exportAsXLSX(element: any): void {
    this.excelService.exportAsExcelFile(element, 'Upload Template');
  }

}
