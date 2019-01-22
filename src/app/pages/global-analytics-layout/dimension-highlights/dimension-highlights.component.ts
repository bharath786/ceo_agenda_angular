import { Component, OnInit, Input } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { Router, NavigationEnd } from '@angular/router';

@Component({
    selector: 'app-dimension-highlights',
    templateUrl: './dimension-highlights.component.html',
    styleUrls: ['./dimension-highlights.component.scss']
})
export class DimensionHighlightsComponent implements OnInit {
    files: any;
    mainvalue: any;
    // ... your class variables here
    navigationSubscription;
    constructor(private router: Router) {
        // subscribe to the router events - storing the subscription so
        // we can unsubscribe later. 
        this.navigationSubscription = this.router.events.subscribe((e: any) => {
            // If it is a NavigationEnd event re-initalise the component
            if (e instanceof NavigationEnd) {
                this.initialiseInvites();
            }
        });
    }

    initialiseInvites() {
        // Set default values and re-fetch any data you need.
        this.getTree();
    }
    ngOnDestroy() {
        // avoid memory leaks here by cleaning up after ourselves. If we  
        // don't then we will continue to run our initialiseInvites()   
        // method on every navigationEnd event.
        if (this.navigationSubscription) {
            this.navigationSubscription.unsubscribe();
        }
    }
    ngOnInit() {
    }

    getTree() {
        this.files = JSON.parse(sessionStorage.getItem('dimensionData'))
        console.log(JSON.parse(sessionStorage.getItem('dimensionData')), 'List')
    }

    unselectFile() {
        this.files = null;
    }

    nodeSelect(event) {
        // console.log(event['node']['label']);
        this.mainvalue = event['node'];
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
