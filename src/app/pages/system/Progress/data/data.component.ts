import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class ProgressDataComponent implements OnInit {
  
  @ViewChild('uploadModal') public uploadModal: ModalDirective;
  @ViewChild('downloadModal') public downloadModal: ModalDirective;



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

}
