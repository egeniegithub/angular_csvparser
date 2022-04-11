import { Component, Input, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import { ModalService } from "../cus-modal/modal.service";

@Component({
  selector: 'app-spreadsheet-parser',
  templateUrl: './spreadsheet-parser.component.html',
  styleUrls: ['./spreadsheet-parser.component.css'],
})
export class SpreadsheetParserComponent implements OnInit {
  @Input() onFinalResponse: (args: any) => void;
  @Input() fileUrl:string = environment.dummyAPI;
  public advanceFeature:string = "0";
  public systemFieldLable = [{
    key: 'first',
    label: "First Name (or Full Name)"
  },
  {
    key: 'last',
    label: "Last Name"
  },
  {
    key: 'middle',
    label: "Middle Name"
  },
  {
    key: 'Name_Formatted',
    label: "Name_formatted"
  },
  {
    key: 'sal',
    label: "Prefix"
  },
  {
    key: 'address',
    label: "Mailing Address"
  }, 
  {
    key: 'city',
    label: "Mailing City"
  }, 
  {
    key: 'st',
    label: "Mailing State"
  }, 
  {
    key: 'zip',
    label: "Mailing Zip Code"
  },
  {
    key: 'address2',
    label: "Mailing Address 2"
  },
  {
    key: 'propertyAddress',
    label: "Property Address"
  },
  {
    key: 'propertyCity',
    label: "Property City"
  },
  {
    key: 'propertySt',
    label: "Property State"
  },
  {
    key: 'propertyZip',
    label: "Property Zip Code"
  },
  {
    key: 'propertyEquity',
    label: "Property Equity"
  }
];
  public requiredSystemFields = ['first', 'address', 'city', 'st', 'zip'];
  public dataList: any = [];
  private dataListHeaders: any = [];
  public mappedHeaders: any = [];
  public alreadyMappedHeaders: any = [];
  public responseData:any = {}
  public testToggle = true
  private createNewFor:string;
  public createNewValue:string;
  public advanceFeatureIcon = true
  public selectBgClass = true
  public baseUrl = environment.baseUrl

  constructor(private http: HttpClient, private modalService: ModalService) {}

  @HostListener('document:click', ['$event'])
    documentClick(event: Event) {
      const target = event.target as HTMLTextAreaElement;
      if (target.id != "dropdownMenuButton") {
        this.advanceFeatureIcon = true
      }
  }

  async getFileData() {
    let req = this.http.get(this.fileUrl, { responseType: 'text' });
    req.subscribe((data: any) => {
      this.csvTextToJson(data);
    });
  }

  ngOnInit(): void {
    (async () => {
      this.getFileData();
    })();
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    let mapped = this.mappedHeaders;
    for (let index = 0; index < mapped.length; index++) {
      if (mapped[index].mappedHeader == '__new') {
        mapped[index].mappedHeader = 'unmapped'
      }
    }

    this.mappedHeaders = mapped
    this.modalService.close(id);
  }

  onAdvanceIconChange(){
    this.advanceFeatureIcon = !this.advanceFeatureIcon
  }


  csvTextToJson(csvRawData: string) {
    const lines = csvRawData.split('\n');
    const result = [];
    const headers = lines[0].split(',');
    const cleanedHeaders = []
    for (let index = 0; index < headers.length; index++) {
      cleanedHeaders.push(headers[index]?.replace("\r",""))
    }
    this.compileHeaders(cleanedHeaders)

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i]) continue;
      const obj = {};
      const currentline = lines[i].split(',');

      for (let j = 0; j < cleanedHeaders.length; j++) {
        const row = currentline[j] ? currentline[j].replace(/[\s]+[,]+|[,]+[\s]+/g, ',').trim() : "";
        if (!obj[cleanedHeaders[j]]) {
          obj[cleanedHeaders[j]] = row;
        }
        
      }
      result.push(obj);
    }
    this.dataList = result
    this.dataListHeaders = cleanedHeaders
    return result;
  }

  compileHeaders(csvHeaders: any){
    const compiled = []
    for (let index = 0; index < csvHeaders.length; index++) {
      
      let mappedValue = this.matchHeader(csvHeaders[index])
      compiled.push({
        fileHeader: csvHeaders[index],
        mappedHeader: mappedValue,
        isIgnored: mappedValue == 'ignore' ? true : false
      })
    }
    this.mappedHeaders = compiled
  }

  matchHeader(header:string):string{
    let word  = header.trim();
    word = word.toLowerCase()
    let matchedField = this.systemDefinedMapping(word)
    if (
      matchedField.length > 0 &&
      !this.alreadyMappedHeaders.includes(matchedField)
    ) {
      this.alreadyMappedHeaders.push(matchedField)
      return matchedField
    }else{
      return "unmapped"
    }
  }

  changeHeader(fileHeader:string,newValue:string, headerIndex: number) : void{
    this.selectBgClass = !this.selectBgClass
    if (newValue == "__new") {      
      this.createNewFor = fileHeader
      this.createNewValue = ""
      this.openModal('custom-modal-1')
    }else{
      let mapped = this.mappedHeaders
      let alreadyMapped = false
      for (let index = 0; index < mapped.length; index++) {
        if (mapped[index].mappedHeader == newValue && newValue != "unmapped" ) {
          alreadyMapped = true
          break
        }
      }
  
      if (!alreadyMapped) {
        for (let index = 0; index < mapped.length; index++) {
          if (mapped[index].fileHeader == fileHeader) {
            if (newValue == "ignore") {
              mapped[headerIndex].isIgnored = true
              break
            }else{
              mapped[headerIndex].mappedHeader = newValue
              break
            }
          }
        }
        this.mappedHeaders = mapped
      }else{
        alert("This field is already mapped with another header.");
      }
    }
    this.returnData()
  }

  returnData() {
    let fileData = this.dataList
    
    let instructions = []
    let healthyRecords = 0
    let unhealthyRecords = 0

    const mapped = this.mappedHeaders
    let requireFields = this.requiredSystemFields
      for (let index = 0; index < fileData.length; index++) {
        let keys = Object.keys(fileData[index])
        let isHealthy = true
        let reasons = []
        
        for (let index2 = 0; index2 < requireFields.length; index2++) {
          let headerAvailable = false
          for (let index3 = 0; index3 < keys.length; index3++) {
            if (requireFields[index2] == keys[index3]) {
              headerAvailable = true
            }
            if (
              !fileData[index][keys[index3]] &&
              requireFields[index2] == keys[index3]
              ) {
                reasons.push(`${requireFields[index2]} value not found.`)
                isHealthy = false
            }
          }
          if (!headerAvailable) {
            reasons.push(`${requireFields[index2]} field not found.`)
            isHealthy = false
          }
        }

        if (!isHealthy) {
          instructions.push({
            index: index,
            isHealthy: false,
            reasons
          })
          unhealthyRecords++
        }else{
          healthyRecords++
        }
        
        
        
      }


    this.responseData = {
      fileHeaders: this.dataListHeaders,
      mappedHeaders: this.mappedHeaders,
      instructions:instructions,
      healthyRecords: healthyRecords,
      unhealthyRecords: unhealthyRecords,
      totalRecords: fileData.length,
      advanceFeature: this.advanceFeature == "1" ? "Ignore All Unmapped Fields" : this.advanceFeature == "2" ? "Add All Unignored/Unmapped" : "Not Selected"
    }

    
    this.onFinalResponse(this.responseData)
    this.openModal('custom-modal-2')
  }

  systemDefinedMapping(header:string): string{
    switch (header) {
      case 'address' || 'addres' || 'adress' || 'mailing address' || 'mailing addres' || 'mailing street' || 'street':
        return 'address'
      case 'address2' || 'address 2' || 'mailing address2' || 'secondary address' || 'unit' || 'apt' || 'apartment' || 'mailing address2' || 'mailing address 2' || 'mailing address2' || 'mailing secondary address' || 'mailing unit' || 'mailing apt' || 'mailing apartment':
        return 'address2'
      case 'city' || 'mailing city':      
        return 'city';
      case 'first' || 'name' || 'first name' || 'firstname' || 'recipient':
        return 'first'
      case 'last' || 'last name' || 'lastname':
        return 'last';
      case 'middle':
        return 'middle';
      case 'name_formatted':
        return 'Name_Formatted'
      case 'sal':
        return 'sal'
      case 'st' || 'state' || 'mailing st' || 'mailing state':
        return 'st'
      case 'zip' || 'zip code' || 'zipcode' || 'zip' || 'postal' || 'postal code' || 'mailing zip' || 'mailing zip code' || 'mailing zipcode' || 'mailing zip' || 'mailing postal' || 'mailing postal code':
        return 'zip'
      case 'propertyaddress' || 'property address' || 'property adress' || 'property addres' || 'property street':
        return 'propertyAddress'
      case 'propertycity' || 'property city':
        return 'propertyCity'
      case 'propertyst' || 'property st' || 'property state':
        return 'propertySt'
      case 'propertyzip' || 'property zip' || 'property zip code' || 'property zipcode' || 'property zip' || 'property postal' || 'property postal code':
        return 'propertyZip'
      case 'propertyequity' || 'property equity' || 'equity':
        return 'propertyEquity'

      default:
        return ''
    }
  }

  onToggle(){
    this.testToggle = !this.testToggle
  }

  onAdvanceFeature(value:string){
    this.advanceFeature = value
    if (value == "2") {
      for (let index = 0; index < this.mappedHeaders.length; index++) {
        if (this.mappedHeaders[index].mappedHeader == 'unmapped' && !this.alreadyMappedHeaders.includes(this.mappedHeaders[index].fileHeader)) {
          this.mappedHeaders[index].mappedHeader = this.mappedHeaders[index].fileHeader
          this.systemFieldLable.push({
            key: this.mappedHeaders[index].fileHeader,
            label: this.mappedHeaders[index].fileHeader
          })
          this.alreadyMappedHeaders.push(this.mappedHeaders[index].fileHeader)
        }
      }
    }else if (value == "1") {
      for (let index = 0; index < this.mappedHeaders.length; index++) {
        if (this.mappedHeaders[index].mappedHeader == 'unmapped') {
          this.mappedHeaders[index].mappedHeader = 'ignore'
          this.mappedHeaders[index].isIgnored = true

          for (let index2 = 0; index2 < this.systemFieldLable.length; index2++) {
            if (this.systemFieldLable[index2].key == this.mappedHeaders[index].fileHeader) {
              this.systemFieldLable.slice(index2, 1)
            }
          }
          this.systemFieldLable.push({
            key: this.mappedHeaders[index].fileHeader,
            label: this.mappedHeaders[index].fileHeader
          })
        }
      }
    }
  }

  createNew() {
    if (!this.createNewValue.trim() || this.createNewValue == 'unmapped') {   
      this.closeModal('custom-modal-1');   
      return false
    }
    let mapped = this.mappedHeaders
      let alreadyMapped = false
      for (let index = 0; index < mapped.length; index++) {
        if (mapped[index].mappedHeader == this.createNewValue) {
          alreadyMapped = true
          break
        }
      }

      if (!alreadyMapped) {
        for (let index = 0; index < mapped.length; index++) {

          if (mapped[index].fileHeader == this.createNewFor) {
            if (this.createNewValue == "ignore") {
              mapped[index].isIgnored = true
              break
            }else{
              mapped[index].mappedHeader = this.createNewValue
              this.systemFieldLable.push({
                key: this.createNewValue,
                label: this.createNewValue
              })
              break
            }
          }
        }
        this.mappedHeaders = mapped
      }else{
        alert("This field is already mapped with another header.");
      }

    this.closeModal('custom-modal-1');
  }

  substringValue(value:string){
    return value.length > 30 ? `${value.substring(0,25)}...` : value
  }

  openToolTip(event: Event){
    event.stopPropagation()
  }


}
