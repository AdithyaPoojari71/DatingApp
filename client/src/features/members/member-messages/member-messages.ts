import { Component, effect, ElementRef, inject, model, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import { MessageService } from '../../../core/services/message-service';
import { Message } from '../../../types/message';
import { DatePipe } from '@angular/common';
import { TimeAgoPipe } from '../../../core/pipes/time-ago-pipe';
import { FormsModule } from '@angular/forms';
import { PresenceSerive } from '../../../core/services/presence-serive';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-messages',
  imports: [DatePipe,TimeAgoPipe,FormsModule],
  templateUrl: './member-messages.html',
  styleUrl: './member-messages.css'
})
export class MemberMessages implements OnInit, OnDestroy {
@ViewChild('messageEndRef') messageEndRef!: ElementRef;
private memberService = inject(MemberService);
protected messageService = inject(MessageService);
 protected presenceService = inject(PresenceSerive);
protected messageContent = model('');
private route = inject(ActivatedRoute);

constructor(){
  effect(() =>{
    const currentMessages = this.messageService.messageThread();
    if(currentMessages.length > 0){
      this.scrollToBottom();
    }
  })
}
  
ngOnInit(): void {
   this.route.parent?.paramMap.subscribe({
      next: params => {
        const otherUserId = params.get('id');
        if (!otherUserId) throw new Error('Cannot connect to hub');
        this.messageService.createHubConnection(otherUserId);
      }
    })
}

ngOnDestroy(): void {
    this.messageService.stopHubConnection();
}

// loadMessage(){
//   const memberId = this.memberService.member()?.id;
//   if(memberId){
//     this.messageService.getMessageThread(memberId).subscribe({
//       next: messages => this.messages.set(messages.map(message =>({
//         ...message,
//         currentUserSender: message.senderId !== memberId
//       }))),
//     })
//   }
// }

sendMessage(){
  const recipientId = this.memberService.member()?.id;
  if(!recipientId || !this.messageContent()) return;
    this.messageService.sendMessage(recipientId,this.messageContent())?.then(() =>{
      this.messageContent.set('');
    })
}

scrollToBottom() {
    setTimeout(() => {
      if (this.messageEndRef) {
        this.messageEndRef.nativeElement.scrollIntoView({ behavior: 'smooth' })
      }
    })
}

}
