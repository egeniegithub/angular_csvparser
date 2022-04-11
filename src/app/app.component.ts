import { Component } from '@angular/core';
import { responseData } from "./interfaces/responseData.interface";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Map Fields';
  public testToggle = true
  public responseData:responseData;
  public advanceFeature:string = "0";


  onAdvanceFeature(value:string){
    this.advanceFeature = value
  }

  onFinalResponse(data:any){
    console.table('data', data)
    this.title = "Mapping Result"
    this.testToggle = false
  }

}
