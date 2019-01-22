import { Component, OnInit } from '@angular/core';
import { AdminsettingsService } from '../../../admin-settings/adminsettings.service';
import { TreeNode } from 'primeng/api';
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'app-highlights',
  templateUrl: './highlights.component.html',
  styleUrls: ['./highlights.component.scss']
})
export class TalentHighlightsComponent implements OnInit {
  files: TreeNode[] = [];
  selectedFile: TreeNode;
  mainvalue: any;

  recruitmentchart = new Chart({
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
            name: 'Recruitment',
            data: [1, 2, 2, 4, 5, 4, 6, 7, 4, 5, 5, 3]

        },

    ]
});

Joiningratiochart = new Chart({
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
        pointFormat: '{series.name}: <b>{point.percentage:.1f}</b>'
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
        name: 'Joining Ratio',
      
        data: [{
            name: 'Quarter 1',
            y: 30,
          
        }, {
            name: 'Quarter 2',
            y: 20
        }, {
            name: 'Quarter 3',
            y: 28
        },
        {
            name: 'Quarter 4',
            y: 22
        }
        ]
    }]
});     

Workexperiencechart = new Chart({
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
            name: 'Work Experience',
            data: [1, 2, 2, 4, 5, 4, 6, 7, 4, 5, 5, 3]

        },

    ]
});


iqchart = new Chart({
    title: {
        text: ''
    },

    credits: {
        enabled: false
    },
    tooltip: {
        headerFormat: '{point.x}<br />',
        pointFormat: 'IQ: <b>{point.y}</b>'
    },
    xAxis: {
        categories: ['Jan-18', 'Feb-18', 'Mar-18', 'Apr-18', 'May-18', 'Jun-18', 'Jul-18', 'Aug-18', 'Sep-18', 'Oct-18', 'Nov-18', 'Dec-18'],
        title: {
            text: 'Frequency'
        }
    },
    yAxis: {
        title: {
            text: 'IQ'
        }
    },
    series: [{
        name: 'IQ Distribution',
        data: [110, 115, 105, 110, 120, 116, 113, 121, 112, 119, 115, 120],

    }]
});



gestationchart = new Chart({
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
        pointFormat: '{series.name}: <b>{point.percentage:.1f}</b>'
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
        name: 'Gestation',
      
        data: [{
            name: 'Quarter 1',
            y: 30,
          
        }, {
            name: 'Quarter 2',
            y: 20
        }, {
            name: 'Quarter 3',
            y: 28
        },
        {
            name: 'Quarter 4',
            y: 22
        }
        ]
    }]
});  




  
  constructor(private treeservice: AdminsettingsService) { }

  ngOnInit() {
    this.treeservice.gettalentJSON()
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
