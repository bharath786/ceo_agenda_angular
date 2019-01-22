import { Component, OnInit } from '@angular/core';
import { AdminsettingsService } from '../../../admin-settings/adminsettings.service';
import { TreeNode } from 'primeng/api';
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'app-highlights',
  templateUrl: './highlights.component.html',
  styleUrls: ['./highlights.component.scss']
})
export class AlignmentHighlightsComponent implements OnInit {
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
    


attritionchart = new Chart({
    title: {
        text: ''
    },

    credits: {
        enabled: false
    },
    tooltip: {
        headerFormat: '{point.x}<br />',
        pointFormat: 'Attrition: <b>{point.y}</b>'
    },
    xAxis: {
        categories: ['Jan-18', 'Feb-18', 'Mar-18', 'Apr-18', 'May-18', 'Jun-18', 'Jul-18', 'Aug-18', 'Sep-18', 'Oct-18', 'Nov-18', 'Dec-18'],
        title: {
            text: 'Frequency'
        }
    },
    yAxis: {
        title: {
            text: ''
        }
    },
    series: [{
        name: '',
        data: [15, 35, 25, 66, 33, 80, 59, 29, 42, 59, 45, 62],
        
    }]
});

quarterlyreviewchart = new Chart({
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
        name: 'Quarterly Review',
      
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

fitnessawardschart = new Chart({
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
        name: 'Fitness Awards',
        data: [6, 7, 9, 8, 4, 4, 6, 11, 10, 10, 15, 13]

    }, 
    
]
});

quartileChart = new Chart({
    chart: {
        type: 'line'
    },
    title: {
        text: 'Quartile Rating'
    },
    subtitle: {
        text: ''
    },
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yAxis: {
        categories: ['Q4', 'Q3-', 'Q3', 'Q3+', 'Q2', 'Q1', 'Q0']
    },
    plotOptions: {
        line: {
            dataLabels: {
                enabled: false
            },
            enableMouseTracking: false
        }
    },
    series: [{
        name: 'Quartile Ranking',
        data: [6, 4, 5, 4, 5, 3, 2, 0, 6, 5, 4, 3]
    }]
});   

fitnessmetricschart = new Chart({
    title: {
        text: ''
    },

    credits: {
        enabled: false
    },
    tooltip: {
        headerFormat: '{point.x}<br />',
        pointFormat: 'Fitness: <b>{point.y}</b>'
    },
    xAxis: {
        categories: ['Jan-18', 'Feb-18', 'Mar-18', 'Apr-18', 'May-18', 'Jun-18', 'Jul-18', 'Aug-18', 'Sep-18', 'Oct-18', 'Nov-18', 'Dec-18'],
        title: {
            text: 'Frequency'
        }
    },
    yAxis: {
        title: {
            text: ''
        }
    },
    series: [{
        name: '',
        data: [15, 35, 25, 66, 33, 80, 59, 29, 42, 59, 45, 62],
        
    }]
});

unplannedleaveschart = new Chart({
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
            "name": "Unplanned Leaves",

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

// attendancemetricschart = new Chart({
//     chart: {
//         type: 'column'
//     },
//     title: {
//         text: ''
//     },
//     credits: {
//         enabled: false
//     },
//     legend: {
//         enabled: false
//     },  

//     xAxis: {
//         categories: [
//             'Jan',
//             'Feb',
//             'Mar',
//             'Apr',
//             'May',
//             'Jun',
//             'Jul',
//             'Aug',
//             'Sep',
//             'Oct',
//             'Nov',
//             'Dec'
//         ],
//         crosshair: true
//     },
//     yAxis: {
//         min: 0,
//         title: {

//             text: null           }
//     },
//     tooltip: {
//         headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
//         pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
//             '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
//         footerFormat: '</table>',
//         shared: true,
//         useHTML: true
//     },
//     plotOptions: {
//         column: {
//             pointPadding: 0.2,
//             borderWidth: 0
//         }
//     },
//     series: [
//         {
//         name: 'Fitness Awards',
//         data: [6, 7, 9, 8, 4, 4, 6, 11, 10, 10, 15, 13]

//     }, 
    
// ]
// });


lateattendancechart = new Chart({
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
        name: 'Late Attendance',
        data: [1, 2, 4, 1, 3, 4, 1, 1, 1, 1, 3, 0]

    }, 
    
]
});

associatepulsechart = new Chart({
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
        name: 'Pulse',
        data: [100, 90, 90, 80, 90, 95, 100, 100, 100, 100, 90, 95]

    }, 
    
]
});

exitinterviewschart = new Chart({
    title: {
        text: ''
    },

    credits: {
        enabled: false
    },
    tooltip: {
        headerFormat: '{point.x}<br />',
        pointFormat: 'Exit Interviews: <b>{point.y}</b>'
    },
    xAxis: {
        categories: ['Jan-18', 'Feb-18', 'Mar-18', 'Apr-18', 'May-18', 'Jun-18', 'Jul-18', 'Aug-18', 'Sep-18', 'Oct-18', 'Nov-18', 'Dec-18'],
        title: {
            text: 'Frequency'
        }
    },
    yAxis: {
        title: {
            text: ''
        }
    },
    series: [{
        name: '',
        data: [15, 35, 25, 66, 33, 80, 59, 29, 42, 59, 45, 62],
        
    }]
});
  
aluminidueschart = new Chart({
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

retenionchart = new Chart({
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
        name: 'Retention',
      
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
attendancemetricschart = new Chart({
    chart: {
        type: 'column'
    },
    credits: {
        enabled: false
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
        ]
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Attendance Metrics'
        },
        stackLabels: {
            enabled: true,
            style: {
                fontWeight: 'bold',
                color: 'gray'
            }
        }
    },

    tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}<br/>Total Working Days: {point.stackTotal}'
    },
    plotOptions: {
        column: {
            stacking: 'normal',
            dataLabels: {
                enabled: false,
                color: 'white'
            }
        }
    },
    series: [{
        name: 'Working Days',
        data: [31, 27, 29, 30, 30, 30, 28, 31, 29, 27, 30, 27]
    },
     {
        name: 'Leaves',
        data: [0, 1, 2, 0, 1, 0, 3, 0, 1, 4, 0, 4]
    }]
})

  constructor(private treeservice: AdminsettingsService) { }

  ngOnInit() {
    this.treeservice.getalignmentJSON()
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
