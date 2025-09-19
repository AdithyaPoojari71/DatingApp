import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { ToastService } from './toast-service';
import { User } from '../../types/user';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { Message } from '../../types/message';
import { MessageService } from './message-service';

@Injectable({
  providedIn: 'root'
})
export class PresenceSerive {
  private hubUrl = environment.hubUrl;
  private toast = inject(ToastService);
  public hubConnection?: HubConnection;
  public onlineUsers =  signal<string[]>([]);
  unreadMessageCount = signal<number>(0);
  
  createHubConnection(user: User){
    this.hubConnection =  new HubConnectionBuilder()
    .withUrl(this.hubUrl + 'presence' ,{
      accessTokenFactory: () => user.token
    })
    .withAutomaticReconnect()
    .build();

    this.hubConnection.start()
    .catch( error => console.log(error));

    this.hubConnection.on('UserIsOnline', userId =>{
      this.onlineUsers.update(users => [...users, userId]);
    })

    this.requestPermission();

    this.hubConnection.on('UserIsOffline', userId =>{
      this.onlineUsers.update(users => users.filter(x => x !== userId));
    })

    this.hubConnection.on('GetOnlineUsers', userIds =>{
      this.onlineUsers.set(userIds);
    })

     this.hubConnection.on('NewMessageReceived', (message: Message) => {
      this.unreadMessageCount.update(count => count + 1);
      this.toast.info(message.senderDisplayName + ' has sent you a new message', 
        10000, message.senderImageUrl, `/members/${message.senderId}/messages`);

        //Show desktop notification if tab is not active
        this.showDesktopNotification(
          `New message from ${message.senderDisplayName}`,
          message.content,
          message.senderImageUrl,
          `/members/${message.senderId}/messages`
        );
    })
  }

  stopHubConnection(){
      if(this.hubConnection?.state === HubConnectionState.Connected){
        this.hubConnection.stop().catch(error => console.log(error))
      }
  }

  private showDesktopNotification(title: string, body: string, icon: string, url: string) {
    // Only show if tab is not active and permission is granted
    if (document.hidden && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body,
        icon,
        tag: url // prevent duplicates for same sender
      });

      // Click on notification brings focus to tab and navigates to chat
      notification.onclick = () => {
        window.focus();
        window.location.href = url;
      };
    }
  }

  private requestPermission() {
  if (!('Notification' in window)) {
    return;
  }

  if (Notification.permission === 'default') {
    Notification.requestPermission().then(permission => {
    });
  }
}


}
