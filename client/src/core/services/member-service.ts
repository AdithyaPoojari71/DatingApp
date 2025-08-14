import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { EditableMember, Member, MemberParams, Photo } from '../../types/member';
import { tap } from 'rxjs';
import { PaginatedResult } from '../../types/pagination';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private http = inject(HttpClient);
  private baseurl = environment.apiUrl;
  editMode = signal(false);
  member = signal<Member | null>(null);


  getMembers(memberParams: MemberParams){
    let params = new HttpParams();

    params = params.append('pageNumber',memberParams.pageNumber);
    params = params.append('pageSize',memberParams.pageSize);
    params = params.append('minAge',memberParams.minAge);
    params = params.append('maxAge',memberParams.maxAge);
    params = params.append('orderBy',memberParams.orderBy);

    if(memberParams.gender) params = params.append('gender', memberParams.gender);

    return this.http.get<PaginatedResult<Member>>(this.baseurl + 'members',{params})
    .pipe(tap(() =>{
      localStorage.setItem('filters',JSON.stringify(memberParams));
    }))
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

  uploadPhoto(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Photo>(this.baseurl + 'members/add-photo', formData);
  }

  setMainPhoto(photo: Photo) {
    return this.http.put(this.baseurl + 'members/set-main-photo/' + photo.id, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseurl + 'members/delete-photo/' + photoId);
  }
}
