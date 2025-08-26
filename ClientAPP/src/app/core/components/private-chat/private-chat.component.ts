import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ChatService } from '../../_services/chat.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-private-chat',
  standalone: false,
  templateUrl: './private-chat.component.html',
  styleUrl: './private-chat.component.css',
})
export class PrivateChatComponent implements OnInit, OnDestroy {
  @Input() toUser = '';

  constructor(
    public chatService: ChatService,
    public activeModal: NgbActiveModal
  ) {}
  ngOnDestroy(): void {
    this.chatService.closePrivateChatMessage(this.toUser);
  }
  ngOnInit(): void {}
  sendMessage(content: string) {
    this.chatService.sendPrivateMessage(this.toUser, content);
  }
}
