import { Component, OnInit, Input } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { Router, NavigationEnd } from '@angular/router';
import { AppSettings } from 'src/app/app.settings';
import { Observable } from 'rxjs/Observable';
import { MenuService } from 'src/app/theme/components/menu/menu.service';
import { AppService } from 'src/app/app.service';


@Component({
    selector: 'app-dimension-highlights',
    templateUrl: './dimension-highlights.component.html',
    styleUrls: ['./dimension-highlights.component.scss']
})
export class DimensionHighlightsComponent implements OnInit {
    files: any;
    mainvalue: any;
    selectedFile: any;
    menuId$: Observable<any>;
    // ... your class variables here
    navigationSubscription;
    constructor(private router: Router, public appSettings: AppSettings, public menuService: MenuService) {


        // subscribe to the router events - storing the subscription so
        // we can unsubscribe later. 
        this.navigationSubscription = this.router.events.subscribe((e: any) => {
            // If it is a NavigationEnd event re-initalise the component
            if (e instanceof NavigationEnd) {
                this.getTree();
            }
        });
    }

    ngOnInit() {
    }

    getTree() {
        this.menuId$ = this.appSettings.getMenuId();
        this.menuService.getDimensionData(this.menuId$).subscribe(
                 data => {
                   this.files = data['data']
                 },
                 error => {
                   console.log(error)
                 }
        );
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
