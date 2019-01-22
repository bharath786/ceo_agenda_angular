import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "dataFilter"
})
export class DataFilterPipe implements PipeTransform {

//For Filter (Search) in tables
 transform(value: any, args?: any): any {

        if(!value)return null;
        if(!args)return value;

        args = args.toLowerCase();

        return value.filter(function(item){
            return JSON.stringify(item).toLowerCase().includes(args);
        });
}
}