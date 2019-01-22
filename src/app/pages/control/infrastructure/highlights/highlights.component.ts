import { Component, OnInit } from '@angular/core';
import { AdminsettingsService } from '../../../admin-settings/adminsettings.service';
import { TreeNode } from 'primeng/api';
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'app-highlights',
  templateUrl: './highlights.component.html',
  styleUrls: ['./highlights.component.scss']
})
export class InfrastructureHighlightsComponent implements OnInit {
  files: TreeNode[] = [];
  selectedFile: TreeNode;
  mainvalue: any;
  selected = 'January';
    

  months = [
      { value: '1', viewValue: 'January' },
      { value: '2', viewValue: 'Febraury' },
      { value: '3', viewValue: 'March' },
      { value: '4', viewValue: 'April' },
      { value: '5', viewValue: 'May' },
      { value: '6', viewValue: 'June' },
      { value: '7', viewValue: 'July' },
      { value: '8', viewValue: 'August' },
      { value: '9', viewValue: 'September' },
      { value: '10', viewValue: 'October' },
      { value: '11', viewValue: 'November' },
      { value: '12', viewValue: 'December' }

  ];

  powerchart = new Chart({
    title: {
        text: ''
    },

    credits: {
        enabled: false
    },
    tooltip: {
        headerFormat: '{point.x}<br />',
        pointFormat: 'Power: <b>{point.y}</b>'
    },
    xAxis: {
        categories: ['Jan-18', 'Feb-18', 'Mar-18', 'Apr-18', 'May-18', 'Jun-18', 'Jul-18', 'Aug-18', 'Sep-18', 'Oct-18', 'Nov-18', 'Dec-18'],
        title: {
            text: 'Frequency'
        }
    },
    yAxis: {
        title: {
            text: 'Power'
        }
    },
    series: [{
        name: 'Power',
        data: [20, 45, 35, 74, 42, 90, 69, 39, 52, 69, 55, 72],

    }]
});

internetchart = new Chart({
  title: {
      text: ''
  },

  credits: {
      enabled: false
  },
  tooltip: {
      headerFormat: '{point.x}<br/>',
      pointFormat: 'Internet: <b>{point.y}</b>'
  },
  xAxis: {
      categories: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'],
      title: {
          text: 'Frequency'
      }
  },
  yAxis: {
      title: {
          text: 'Internet'
      }
  },
  series: [{
      name: 'Internet',
      data: [11, 16, 26, 33, 31, 38, 37, 41, 49, 46, 51, 50, 55, 49, 56, 53, 50, 59, 59, 52, 59, 45, 62, 58, 52, 45, 55, 33, 48, 48],

  }]
});

hygienechart = new Chart({
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

          text: null           }
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
      name: 'Hygiene',
      data: [6, 7, 9, 8, 4, 4, 6, 11, 10, 10, 15, 13]

  }, 
  
]
});

workstationschart = new Chart({
  title: {
      text: ''
  },

  xAxis: {
      categories: ['1st Quarter', '2nd Quarter', '3rd Quarter', '4th Quarter']
  },

  series: [{
      type: 'column',
      name: '1st Month',
      data: [3, 2, 1, 3]
  }, {
      type: 'column',
      name: '2nd Month',
      data: [3, 3, 5, 7]
  }, {
      type: 'column',
      name: '3rd Month',
      data: [4, 3, 3, 9]
  },
  {
      type: 'spline',
      name: 'Total',
      data: [10, 8, 9, 19],

  }],
  credits: {
      enabled: false
  },
  legend: {
      enabled: false
  },
});

discussionroomschart = new Chart({
  chart: {
      type: 'column'
  },
  title: {
      text: ''
  },

  credits: {
      enabled: false
  },

  xAxis: {
      type: 'category'
  },
  yAxis: {
      title: {
          text: ''
      }

  },
  legend: {
      enabled: false
  },
  plotOptions: {
      series: {

          dataLabels: {
              enabled: true,
              format: '{point.y:.1f}'
          }
      }
  },

  tooltip: {
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}</b> of total<br/>'
  },

  "series": [
      {
          "name": "Discussion Rooms",

          "data": [
              {
                  "name": "1st Week",
                  "y": 15,
                  "drilldown": "1st Week"
              },
              {
                  "name": "2nd Week",
                  "y": 25,
                  "drilldown": "2nd Week"
              },
              {
                  "name": "3rd Week",
                  "y": 27,
                  "drilldown": "3rd Week"
              },
              {
                  "name": "4th Week",
                  "y": 22,
                  "drilldown": "4th Week"
              },

          ]
      }
  ]

});

silencechart = new Chart({
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
      name: 'Silence',
    
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

ambiencechart = new Chart({
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

          text: null           }
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
      name: 'Ambience',
      data: [6, 7, 9, 8, 4, 4, 6, 11, 10, 10, 15, 13]

  }, 
  
]
});


airconditioningchart = new Chart({
  chart: {
      type: 'areaspline'
  },
  title: {
      text: ''
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

  },
  yAxis: {
      title: {
          text: ''
      }
  },
  tooltip: {
      valueSuffix: ''
  },
  credits: {
      enabled: false
  },

  series: [{
      name: 'Air Conditioning',
      data: [1, 2, 2, 4, 5, 4, 6, 7, 4, 5, 5, 3]
  }]

})

waterchart = new Chart({
  chart: {
      type: 'areaspline'
  },
  title: {
      text: ''
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

  },
  yAxis: {
      title: {
          text: ''
      }
  },
  tooltip: {
      valueSuffix: ' Water'
  },
  credits: {
      enabled: false
  },

  series: [{
      name: 'Water',
      data: [1, 2, 2, 4, 5, 4, 6, 7, 4, 5, 5, 3]
  }]

})
  
diningchart = new Chart({
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

          text: null           }
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
      name: 'Dining',
      data: [6, 7, 9, 8, 4, 4, 6, 11, 10, 10, 15, 13]

  }, 
  
]
});
  
  constructor(private treeservice: AdminsettingsService) { }

  ngOnInit() {
    this.treeservice.getinfrastructureJSON()
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
