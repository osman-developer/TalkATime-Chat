import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PrivateChatComponent } from '../private-chat/private-chat.component';

@Component({
  selector: 'app-online-users',
  standalone: false,
  templateUrl: './online-users.component.html',
  styleUrl: './online-users.component.css',
})
export class OnlineUsersComponent {
  @Input() myName: string=''
  @Input() onlineUsers:  any[] = [];
  constructor(private modalService: NgbModal) {}

  openPrivateChat(user: any) {
    const modalRef = this.modalService.open(PrivateChatComponent);
    modalRef.componentInstance.toUser = user;
  }
}
