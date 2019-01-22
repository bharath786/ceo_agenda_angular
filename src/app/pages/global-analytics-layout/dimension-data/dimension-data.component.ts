import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-dimension-data',
  templateUrl: './dimension-data.component.html',
  styleUrls: ['./dimension-data.component.scss']
})
export class DimensionDataComponent implements OnInit {
  @ViewChild('uploadModal') public uploadModal: ModalDirective;
  @ViewChild('downloadModal') public downloadModal: ModalDirective;
  arrayBuffer: any;




  downloadModalToggle(e){
    if(e==1){
      this.downloadModal.show();
    }
    else{
      this.downloadModal.hide();
    }
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
  constructor() { }

  ngOnInit() {
  }
  public changeListener(files: FileList[]){
    console.log(files)
    // files.forEach(element => {
    //   console.log(element)
    // });

  }

}
