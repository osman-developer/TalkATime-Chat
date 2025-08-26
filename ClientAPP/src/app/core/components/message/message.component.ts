import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-message',
  standalone: false,
  templateUrl: './message.component.html',
  styleUrl: './message.component.css',
})
export class MessageComponent {
  @Input() messages: any[] = [];
  @Input() connectedUser: string = '';
}
