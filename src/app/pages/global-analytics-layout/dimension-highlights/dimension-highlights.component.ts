import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { Router, NavigationEnd, ActivatedRoute  } from '@angular/router';
import { AppSettings } from 'src/app/app.settings';
import { Observable } from 'rxjs/Observable';
import { MenuService } from 'src/app/theme/components/menu/menu.service';

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
    kpivalue: any;
    dimId : any;
    constructor(private activeRoute: ActivatedRoute, private router: Router, public appSettings: AppSettings, public menuService: MenuService) {
        // subscribe to the router events - storing the subscription so
        // we can unsubscribe later. 
        this.navigationSubscription = this.router.events.subscribe((e: any) => {
            // If it is a NavigationEnd event re-initalise the component
            if (e instanceof NavigationEnd) {
                //this.getTree();
            }
        });
    }

    ngOnInit() {
        this.activeRoute.params.subscribe(params => {
            // this.dimId = crypto.DES.decrypt(params['dimId'].toString(), "DIMID").toString(crypto.enc.Utf8);
            this.dimId = atob(params['dimId'].toString());
            this.getTree();
        });
    }


    getTree() {
        //this.menuId$ = this.appSettings.getMenuId();
        this.menuService.getDimensionData(this.dimId).subscribe(
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
        if(this.mainvalue['KPIId'] != null){
            this.kpivalue = this.mainvalue['KPIId']
            localStorage.setItem('kpiDetails', JSON.stringify({ 
            kpiId:this.kpivalue,
            kpiName:this.mainvalue['KPIName'],
            kpiCode:this.mainvalue['KPICode'], 
            frequencyId:this.mainvalue['frequencyId'], 
            PriorityTypeId:this.mainvalue['PriorityTypeId'], 
            dataTypeId:this.mainvalue['dataTypeId'], 
            isScope:this.mainvalue['isScope'], 
            scopeAlias:this.mainvalue['scopeAlias'],
            minMax:this.mainvalue['minMax']
        }));   
            console.log(localStorage['kpiDetails'])           
        }
        else{
            localStorage.setItem('kpiDetails', null);   
        }
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
