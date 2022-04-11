import { Component, Input, OnInit } from '@angular/core';
import {responseData} from "../interfaces/responseData.interface";

@Component({
  selector: 'app-show-test',
  templateUrl: './show-test.component.html',
  styleUrls: ['./show-test.component.css']
})
export class ShowTestComponent implements OnInit {
  @Input() responseData:responseData;
  public mappedheaders:any = []
  public fileData:any = []

  constructor() {
    this.mappedheaders = this.responseData.mappedHeaders
    this.fileData = this.responseData.fileData
  }

  ngOnInit(): void {
  }

}
