import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-advance-feature',
  templateUrl: './advance-feature.component.html',
  styleUrls: ['./advance-feature.component.css']
})
export class AdvanceFeatureComponent implements OnInit {

  @Input() onAdvanceFeature: (args: any) => void;
  @Input() advanceFeature:string;

  constructor() { }

  ngOnInit(): void {
  }

}
