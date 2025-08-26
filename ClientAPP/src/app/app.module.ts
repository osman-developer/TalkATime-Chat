import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './core/components/navbar/navbar.component';
import { FooterComponent } from './core/components/footer/footer.component';
import { HomeComponent } from './core/components/home/home.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChatComponent } from './core/components/chat/chat.component';
import { ChatInputComponent } from './core/components/chat-input/chat-input.component';
import { MessageComponent } from './core/components/message/message.component';
import { OnlineUsersComponent } from './core/components/online-users/online-users.component';
import { PrivateChatComponent } from './core/components/private-chat/private-chat.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    ChatComponent,
    ChatInputComponent,
    MessageComponent,
    OnlineUsersComponent,
    PrivateChatComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
