import { Component, OnInit, Input,OnDestroy, ElementRef } from '@angular/core';
import { ModalService } from "./modal.service";

@Component({
  selector: 'app-cus-modal',
  templateUrl: './cus-modal.component.html',
  styleUrls: ['./cus-modal.component.css']
})
export class CusModalComponent implements OnInit, OnDestroy {
  @Input() id: string;
  @Input() cuswidth: number;
  private element: any;

  constructor(private modalService: ModalService, private el: ElementRef) {
    this.element = el.nativeElement;
  }

  ngOnInit(): void {
    // ensure id attribute exists
    if (!this.id) {
      console.error('modal must have an id');
      return;
  }

    // move element to bottom of page (just before </body>) so it can be displayed above everything else
    document.body.appendChild(this.element);

    // close modal on background click
    // this.element.addEventListener('click', el => {
    //     if (el.target.className === 'cus-modal') {
    //         this.close();
    //     }
    // });

    // add self (this modal instance) to the modal service so it's accessible from controllers
    this.modalService.add(this);
  }

  // remove self from modal service when component is destroyed
  ngOnDestroy(): void {
      this.modalService.remove(this.id);
      this.element.remove();
  }

  // open modal
  open(): void {
      this.element.style.display = 'block';
      document.body.classList.add('cus-modal-open');
  }

  // close modal
  close(): void {
      this.element.style.display = 'none';
      document.body.classList.remove('cus-modal-open');
  }

}
