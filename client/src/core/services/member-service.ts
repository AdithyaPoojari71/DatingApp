import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member, Photo } from '../../types/member';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private http = inject(HttpClient);
  private baseurl = environment.apiUrl;

  getMembers(){
    return this.http.get<Member[]>(this.baseurl + 'members');
  }

  getMember(id:string){
    return this.http.get<Member>(this.baseurl + 'members/' + id);
  }

  getMemberPhotos(id:string){
    return this.http.get<Photo[]>(this.baseurl + 'members/' + id + '/photos');
  }
}
