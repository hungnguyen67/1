import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FlashMessageComponent } from './shared/components/flash-message/flash-message.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterModule, FlashMessageComponent]
})
export class AppComponent {
  title = 'QLSV';
}