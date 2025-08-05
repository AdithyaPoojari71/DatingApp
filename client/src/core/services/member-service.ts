import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { EditableMember, Member, Photo } from '../../types/member';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private http = inject(HttpClient);
  private baseurl = environment.apiUrl;
  editMode = signal(false);
  member = signal<Member | null>(null);


  getMembers(){
    return this.http.get<Member[]>(this.baseurl + 'members');
  }

  getMember(id:string){
    return this.http.get<Member>(this.baseurl + 'members/' + id).pipe(
      tap(member =>{
        this.member.set(member);
      })
    )
  }

  getMemberPhotos(id:string){
    return this.http.get<Photo[]>(this.baseurl + 'members/' + id + '/photos');
  }

  updateMember(member: EditableMember){
    return this.http.put(this.baseurl + 'members', member);
  }
}
