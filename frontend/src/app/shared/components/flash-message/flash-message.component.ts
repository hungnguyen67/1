import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { FlashMessage, FlashMessageService } from '../../services/flash-message.service';

@Component({
  selector: 'app-flash-message',
  templateUrl: './flash-message.component.html',
})
export class FlashMessageComponent implements OnInit, OnDestroy {
  messages: FlashMessage[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private flashMessageService: FlashMessageService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.subscription = this.flashMessageService.messages$.subscribe(
      msgs => {
        console.log('Flash messages updated:', msgs);
        this.messages = msgs;
        this.cdr.detectChanges();
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  removeMessage(message: FlashMessage): void {
    this.flashMessageService.removeMessage(message);
  }

  trackByFn(index: number, item: FlashMessage): any {
    return item.timestamp || index;
  }
}