import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AccountService } from './account-service';
import { ToastService } from './toast-service';
import { PaginatedResult } from '../../types/pagination';
import { Message } from '../../types/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private baseUrl = environment.apiUrl;
  private hubUrl = environment.hubUrl;
  private http = inject(HttpClient);
  private accountService = inject(AccountService);
  private toast = inject(ToastService);
  // private hubConnection?: HubConnection;
  // messageThread = signal<Message[]>([]);

  // createHubConnection(otherUserId: string) {
  //   const currentUser = this.accountService.currentUser();
  //   if (!currentUser) return;
  //   this.hubConnection = new HubConnectionBuilder()
  //     .withUrl(this.hubUrl + 'messages?userId=' + otherUserId, {
  //       accessTokenFactory: () => currentUser.token
  //     })
  //     .withAutomaticReconnect()
  //     .build();

  //   this.hubConnection.start().catch(error => console.log(error));

  //   this.hubConnection.on('ReceiveMessageThread', (messages: Message[]) => {
  //     this.messageThread.set(messages.map(message => ({
  //         ...message,
  //         currentUserSender: message.senderId !== otherUserId
  //       })))
  //   });

  //   this.hubConnection.on('NewMessage', (message: Message) => {
  //     message.currentUserSender = message.senderId === currentUser.id;
  //     this.messageThread.update(messages => [...messages, message])
  //   });
  // }

  // stopHubConnection() {
  //   if (this.hubConnection?.state === HubConnectionState.Connected) {
  //     this.hubConnection.stop().catch(error => console.log(error))
  //   }
  // }

  getMessages(container: string, pageNumber: number, pageSize: number) {
    let params = new HttpParams();

    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);
    params = params.append('container', container);

    return this.http.get<PaginatedResult<Message>>(this.baseUrl + 'message', {params});
  }

  getMessageThread(memberId: string) {
    return this.http.get<Message[]>(this.baseUrl + 'message/thread/' + memberId);
  }

  sendMessage(recipientId: string, content: string) {
    //return this.hubConnection?.invoke('SendMessage', {recipientId, content})
    return this.http.post<Message>(this.baseUrl + 'message', {recipientId,content})
  }

  deleteMessage(id: string) {
    return this.http.delete(this.baseUrl + 'message/' + id);
  }
}
