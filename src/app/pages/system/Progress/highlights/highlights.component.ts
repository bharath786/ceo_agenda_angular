import { Component, OnInit } from '@angular/core';
import { AdminsettingsService } from '../../../admin-settings/adminsettings.service';
import { TreeNode } from 'primeng/api';
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'app-highlights',
  templateUrl: './highlights.component.html',
  styleUrls: ['./highlights.component.scss']
})
export class ProgressHighlightsComponent implements OnInit {
  files: TreeNode[] = [];
  selectedFile: TreeNode;
  mainvalue: any;

    
  chart = new Chart({
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },

    credits: {
        enabled: false
    },
    title: {
        text: ''
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: false
            },
            showInLegend: true
        }
    },
    series: [{
        name: 'Marketing',
        //colorByPoint: true,
        data: [{
            name: 'Business Development',
            y: 61.41,
            //sliced: true,
            //selected: true
        }, {
            name: 'Reputation',
            y: 11.84
        }, {
            name: 'Coverage',
            y: 10.85
        }
        ]
    }]
});

skills = new Chart({
    chart: {
        type: 'column'
    },
    title: {
        text: ''
    },
    credits: {
        enabled: false
    },
    legend: {
        enabled: false
    },

    xAxis: {
        categories: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ],
        crosshair: true
    },
    yAxis: {
        min: 0,
        title: {

            text: null
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: [
        {
            name: 'Skills',
            data: [1, 2, 2, 4, 5, 4, 6, 7, 4, 5, 5, 3]

        },

    ]
});

monetary = new Chart({
    title: {
        text: ''
    },

    credits: {
        enabled: false
    },
    tooltip: {
        headerFormat: '{point.x}<br />',
        pointFormat: ' Monetary: <b>{point.y}</b>'
    },
    xAxis: {
        categories: ['Jan-18', 'Feb-18', 'Mar-18', 'Apr-18', 'May-18', 'Jun-18', 'Jul-18', 'Aug-18', 'Sep-18', 'Oct-18', 'Nov-18', 'Dec-18'],
        title: {
            text: 'Frequency'
        }
    },
    yAxis: {
        title: {
            text: 'Leads'
        }
    },
    series: [{
        name: '',
        data: [15, 35, 25, 66, 33, 80, 59, 29, 42, 59, 45, 62],
        
    }]
});


BPchart = new Chart({
    chart: {
      type: 'line'
    },
    credits: {
      enabled: false
    },
    title: {
      text: 'Blood Pressure'
    },
    xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      title: {
        text: 'Heart Rate(Pulse)'
      }

    },
    yAxis: {
      title: {
        text: 'Blood Pressure'
      }
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'top'
    },
    plotOptions: {
      line: {
        dataLabels: {
          enabled: true
        },
        enableMouseTracking: true
      }
    },
    series: [{
      name: 'Systolic',
      data: [120, 120, 120, 120, 135, 135, 135, 135, 120, 120, 120, 120]
    }, {
      name: 'Diastolic',
      data: [80, 80, 80, 70, 70, 70, 90, 90, 90, 80, 80, 80]
    }]
  });


  BMIchart = new Chart({
    chart: {
      type: 'line'
    },
    credits: {
      enabled: false
    },
    title: {
      text: 'BODY MASS INDEX'
    },
    xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    yAxis: {
      title: {
        text: 'BMI'
      }
    },

    plotOptions: {
      line: {
        dataLabels: {
          enabled: true
        },
        enableMouseTracking: true
      }
    },
    series: [{
      name: 'BMI',
      data: [18, 18, 17.5, 15.7, 20, 21, 22, 21.5, 22.4, 20.4, 19, 20]
    }]
  });

  pulsechart = new Chart({
    chart: {
      type: 'line'
    },
    credits: {
      enabled: false
    },
    title: {
      text: 'HEART RATE (PULSE)'
    },
    xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    yAxis: {
      title: {
        text: 'Pulse'
      }
    },

    plotOptions: {
      line: {
        dataLabels: {
          enabled: true
        },
        enableMouseTracking: true
      }
    },
    series: [{
      name: 'Pulse',
      data: [75, 72, 72, 72, 80, 80, 80, 80, 82, 82, 82, 82]
    }]
  });

  FPchart = new Chart({
    chart: {
      type: 'line'
    },
    credits: {
      enabled: false
    },
    title: {
      text: 'FAT PERCENTAGE'
    },
    xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    yAxis: {
      title: {
        text: 'FAT CONTENT(in Percentage)'
      }
    },
   
    plotOptions: {
      line: {
        dataLabels: {
          enabled: true
        },
        enableMouseTracking: true
      }
    },
    series: [{
      name: 'Fat Percentage',
      data: [25, 25, 25, 25, 22, 22, 22, 22, 27, 28, 28, 28]
    }]
  });


  
  constructor(private treeservice: AdminsettingsService) { }

  ngOnInit() {
    this.treeservice.getprogressJSON()
    .subscribe(
      files => {
        
        this.files = files['data'];
        console.log(this.files)
      },
      error => {
      });
  }


  
  unselectFile() {
    this.files = null;
}

nodeSelect(event) {
  // console.log(event['node']['label']);
  this.mainvalue = event['node']['label'];
  console.log(this.mainvalue);
}

private expandRecursive(node:TreeNode, isExpand:boolean){
  node.expanded = isExpand;
  if(node.children){
      node.children.forEach( childNode => {
          this.expandRecursive(childNode, isExpand);
      } );
  }
}

expandAll(){
  this.files.forEach( node => {
      this.expandRecursive(node, true);
  } );
}

collapseAll(){
  this.files.forEach( node => {
      this.expandRecursive(node, false);
  } );
}
}
