import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import * as XLSX from 'xlsx';
import { AdminsettingsService } from '../../admin-settings/adminsettings.service';
import { DownloadExcelService } from '../../download-excel.service';

@Component({
  selector: 'app-dimension-data',
  templateUrl: './dimension-data.component.html',
  styleUrls: ['./dimension-data.component.scss']
})
export class DimensionDataComponent implements OnInit {
  @ViewChild('uploadModal') public uploadModal: ModalDirective;
  @ViewChild('downloadModal') public downloadModal: ModalDirective;
  arrayBuffer: any;
  kpiCode: any;
  kpiName: any;
  kpiDetails: any;
  dimensionFrequency: any;
  kpiDataType: any;
  file: File;
  KPIPriorityType: any;

  constructor(public _adminsettindservice: AdminsettingsService, public excelService: DownloadExcelService) { }

  ngOnInit() {
    if(localStorage['kpiDetails'] != null){
      this.kpiDetails = JSON.parse(localStorage['kpiDetails']);
      console.log(this.kpiDetails);
      this.kpiDetails['minValue'] = this.kpiDetails.minMax[0];
      this.kpiDetails['maxValue'] = this.kpiDetails.minMax[1];
      this.getDimensionFrequencies();
      this.getKpiDataType(); 
    }
  }

  downloadModalToggle(e){
    if(e==1){
      this.downloadModal.show();
    }
    else{
      this.downloadModal.hide();
    }
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
    }
    fileReader.readAsArrayBuffer(this.file);
    this.uploadModal.hide();
  }

  uploadModalToggle(e)
  {
    if(e==1){
      this.uploadModal.show();
    }
    else{
      this.uploadModal.hide();
    }
  }

  downloadDatasample() {
    let data = [];
    if(this.kpiDataType == 'Text Numeric'){
      data.push({ 'ScopeValue': '', 'ScopeCode': '' , 'Text':'', 'Value':''})
    }
    else if(this.kpiDataType=='Text'){
      data.push({ 'ScopeValue': '', 'ScopeCode': '' , 'Text':'', })
    }
    else if(this.kpiDataType =='Numeric'){
    data.push({ 'ScopeValue': '', 'ScopeCode': '' ,'Value':''})
    }
    else if(this.kpiDataType == 'BInary'){
    data.push({ 'ScopeValue': '', 'ScopeCode': '' , 'Enter Yes/No':'' })
    }
    console.log(data)
    this.excelService.exportAsExcelFile(data, 'DataSample');
  }


    //For Getting Dimension Frequencies for Dropdown
    getDimensionFrequencies() {
      this._adminsettindservice.getDimensionFrequency().subscribe(
        data => {
          //Assigning the values to the dimension frequency variable
          this.dimensionFrequency = data['data']
         this.dimensionFrequency = this.dimensionFrequency.filter(x=>x.lookupId == this.kpiDetails.frequencyId);
         this.dimensionFrequency = this.dimensionFrequency[0]['lookupName']

         console.log(this.dimensionFrequency,'Dimension Frequency')
        },
        error => {
          console.log(error);
        }
      )
    }

      //For Getting KPI Data Types for Dropdown
  getKpiDataType() {
    this._adminsettindservice.getKpiDataType().subscribe(
      data => {
        //Assigning the values to the KPI Datatype variable
        this.kpiDataType = data['data']
        this.kpiDataType = this.kpiDataType.filter(x=>x.lookupId == this.kpiDetails.dataTypeId)
        this.kpiDataType = this.kpiDataType[0]['lookupName']
        console.log(this.kpiDataType, 'Data Type')
        this.KPIPriorityType = data['data1']
        this.KPIPriorityType = this.KPIPriorityType.filter(x=>x.lookupId == this.kpiDetails.PriorityTypeId)
        this.KPIPriorityType = this.KPIPriorityType[0]['lookupName']
        console.log(this.KPIPriorityType, 'proiritytype')
      },
      error => {
        console.log(error);
      }
    )
  }

}

