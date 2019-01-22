import { verticalMenuItems } from './../../../../theme/components/menu/menu';
import { Component, OnInit } from '@angular/core';
import { AdminsettingsService } from '../../../admin-settings/adminsettings.service';
import { TreeNode } from 'primeng/api';
import { Chart } from 'angular-highcharts';

@Component({
    selector: 'app-highlights',
    templateUrl: './highlights.component.html',
    styleUrls: ['./highlights.component.scss']
})
export class SolutionsHighlightsComponent implements OnInit {
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

    domains = new Chart({
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
                name: 'Domains',
                data: [1, 2, 2, 4, 5, 4, 6, 7, 4, 5, 5, 3]

            },

        ]
    });


    sites = new Chart({
        title: {
            text: ''
        },

        credits: {
            enabled: false
        },
        tooltip: {
            headerFormat: '{point.x}<br />',
            pointFormat: 'Sites: <b>{point.y}</b>'
        },
        xAxis: {
            categories: ['Jan-18', 'Feb-18', 'Mar-18', 'Apr-18', 'May-18', 'Jun-18', 'Jul-18', 'Aug-18', 'Sep-18', 'Oct-18', 'Nov-18', 'Dec-18'],
            title: {
                text: 'Frequency'
            }
        },
        yAxis: {
            title: {
                text: 'Sites'
            }
        },
        series: [{
            name: 'Sites',
            data: [15, 35, 25, 66, 33, 80, 59, 29, 42, 59, 45, 62],

        }]
    });

    locations = new Chart({
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
            valueSuffix: ' Locations'
        },
        credits: {
            enabled: false
        },

        series: [{
            name: 'Locations',
            data: [1, 2, 2, 4, 5, 4, 6, 7, 4, 5, 5, 3]
        }]

    })

    status = new Chart({
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
                text: 'Status'
            },
            stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold',
                    color: 'gray'
                }
            }
        },
        legend: {
            align: 'right',
            x: -30,
            verticalAlign: 'top',
            y: 25,
            floating: true,
            backgroundColor: 'white',
            borderColor: '#CCC',
            borderWidth: 1,
            shadow: false
        },
        tooltip: {
            headerFormat: '<b>{point.x}</b><br/>',
            pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
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
            name: 'UI',
            data: [5, 3, 4, 7, 2, 3, 5, 6, 2, 5, 6, 1]
        }, {
            name: 'Development',
            data: [5, 5, 8, 7, 3, 4, 5, 6, 2, 5, 6, 4]
        }, {
            name: 'Testing',
            data: [5, 3, 4, 7, 2, 3, 5, 6, 2, 5, 6, 8]
        }]
    })


    constructor(private treeservice: AdminsettingsService) { }

    ngOnInit() {
        this.treeservice.getsoltionsJSON()
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

    private expandRecursive(node: TreeNode, isExpand: boolean) {
        node.expanded = isExpand;
        if (node.children) {
            node.children.forEach(childNode => {
                this.expandRecursive(childNode, isExpand);
            });
        }
    }

    expandAll() {
        this.files.forEach(node => {
            this.expandRecursive(node, true);
        });
    }

    collapseAll() {
        this.files.forEach(node => {
            this.expandRecursive(node, false);
        });
    }
}
