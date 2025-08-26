import { Injectable } from '@angular/core';
import { BaseApiService } from './baseAPI.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { catchError, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AddUserDTO } from '../_dtos/AddUser.dto';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { AddMessageDTO } from '../_dtos/AddMessage.dto';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PrivateChatComponent } from '../components/private-chat/private-chat.component';

@Injectable({
  providedIn: 'root',
})
export class ChatService extends BaseApiService {
  myName = '';
  private chatConnection?: HubConnection;

  onlineUsers: string[] = [];
  messages: AddMessageDTO[] = [];
  privateMessages: AddMessageDTO[] = [];
  privateMessageInitiated = false;

  constructor(
    protected override http: HttpClient,
    private modalService: NgbModal
  ) {
    super(`${environment.apiUrl}/${environment.chat}`, http);
  }

  registerUser(user: AddUserDTO): Observable<any> {
    return this.post(user, 'register-user');
  }

  createChatConnection() {
    if (this.chatConnection) {
      this.stopChatConnection();
    }

    this.chatConnection = new HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/hubs/chat`)
      .withAutomaticReconnect()
      .build();

    this.chatConnection
      .start()
      .catch((err) => console.error('Connection error:', err));

    this.chatConnection.on('UserConnected', () => this.addUserConnectionId());
    this.chatConnection.on('OnlineUsers', (onlineUsers: string[]) => {
      this.onlineUsers = [...onlineUsers];
    });

    this.chatConnection.on('NewMessage', (newMessage: AddMessageDTO) => {
      this.messages = [...this.messages, newMessage];
    });

    this.chatConnection.on('OpenPrivateChat', (newMessage: AddMessageDTO) => {
      this.privateMessages = [...this.privateMessages, newMessage];
      this.privateMessageInitiated = true;

      const modalRef = this.modalService.open(PrivateChatComponent);
      modalRef.componentInstance.toUser = newMessage.from;
    });

    this.chatConnection.on('NewPrivateMessage', (newMessage: AddMessageDTO) => {
      this.privateMessages = [...this.privateMessages, newMessage];
    });

    this.chatConnection.on('ClosePrivateChat', () => {
      this.privateMessageInitiated = false;
      this.privateMessages = [];
      this.modalService.dismissAll();
    });
  }

  stopChatConnection() {
    this.chatConnection
      ?.stop()
      .catch((err) => console.error('Stop error:', err));
  }

  async addUserConnectionId() {
    try {
      await this.chatConnection?.invoke('AddUserConnectionId', this.myName);
    } catch (err) {
      console.error('AddUserConnectionId error:', err);
    }
  }

  async sendMessage(content: string) {
    const msg: AddMessageDTO = { from: this.myName, content };
    try {
      await this.chatConnection?.invoke('ReceiveMessage', msg);
    } catch (err) {
      console.error('SendMessage error:', err);
    }
  }

  async closePrivateChatMessage(otherUser: string) {
    try {
      await this.chatConnection?.invoke(
        'RemovePrivateChat',
        this.myName,
        otherUser
      );
    } catch (err) {
      console.error('ClosePrivateChat error:', err);
    }
  }

  async sendPrivateMessage(to: string, content: string) {
    const msg: AddMessageDTO = { from: this.myName, to, content };

    try {
      if (!this.privateMessageInitiated) {
        this.privateMessageInitiated = true;
        await this.chatConnection?.invoke('CreatePrivateChat', msg);
        this.privateMessages = [...this.privateMessages, msg];
      } else {
        await this.chatConnection?.invoke('ReceivePrivateMessage', msg);
      }
    } catch (err) {
      console.error('SendPrivateMessage error:', err);
    }
  }
}
