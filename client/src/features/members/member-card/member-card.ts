import { Component, computed, inject, input } from '@angular/core';
import { Member } from '../../../types/member';
import { RouterLink } from '@angular/router';
import { AgePipe } from '../../../core/pipes/age-pipe';
import { LikesService } from '../../../core/services/likes-service';
import { PresenceSerive } from '../../../core/services/presence-serive';

@Component({
  selector: 'app-member-card',
  imports: [RouterLink,AgePipe],
  templateUrl: './member-card.html',
  styleUrl: './member-card.css'
})
export class MemberCard {
  private likeService = inject(LikesService);
  private presenceService = inject(PresenceSerive);

  member = input.required<Member>();
  protected hasLiked = computed(() => this.likeService.likeIds().includes(this.member().id));
  protected isOnline = computed(() => 
    this.presenceService.onlineUsers().includes(this.member().id));

  toggleLike(event: Event) {
    //it witll stop routing
    event.stopPropagation();
    this.likeService.toggleLike(this.member().id)
  }

}
