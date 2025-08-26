import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ChatService } from '../../_services/chat.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PrivateChatComponent } from '../private-chat/private-chat.component';

@Component({
  selector: 'app-chat',
  standalone: false,
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit, OnDestroy {
  constructor(
    public chatSerivce: ChatService,
    private modalService: NgbModal
  ) {}
  ngOnDestroy(): void {
    this.chatSerivce.stopChatConnection();
  }

  ngOnInit(): void {
    this.chatSerivce.createChatConnection();
  }

  @Output() closeChatEmitter = new EventEmitter();

  openPrivateChat(user: any) {
    const modalRef = this.modalService.open(PrivateChatComponent);
    modalRef.componentInstance.toUser = user;
  }

  sendMessage(content: string) {
    this.chatSerivce.sendMessage(content);
  }

  backToHome() {
    this.closeChatEmitter.emit();
  }
}
