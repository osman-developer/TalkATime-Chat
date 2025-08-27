import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ChatService } from '../../_services/chat.service';

@Component({
  selector: 'app-chat',
  standalone: false,
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit, OnDestroy {
  constructor(public chatSerivce: ChatService) {}
  ngOnDestroy(): void {
    this.chatSerivce.stopChatConnection();
  }

  ngOnInit(): void {
    this.chatSerivce.createChatConnection();
  }

  @Output() closeChatEmitter = new EventEmitter();

  sendMessage(content: string) {
    this.chatSerivce.sendMessage(content);
  }

  backToHome() {
    this.closeChatEmitter.emit();
  }
}
