using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface ILikeRepository
    {
        Task<MemberLike?> GetMemberLike(string sourceMemberId, string targetMemberId);
        Task<PaginatedResult<Member>> GetMembersLikes(LikesParams likesParams);
        Task<IReadOnlyList<string>> GetCurrentMemberLikeIds(string memberId);

        void AddLike(MemberLike like);
        void DeleteLike(MemberLike like);
        Task<bool> SaveAllAsync();
    }

}
