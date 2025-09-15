using API.Data;

namespace API.Interfaces
{
    public interface IUnitOfWork
    {
        IMemberRepository MemberRepository { get; }
        IMessageRepository MessageRepository { get; }
        ILikeRepository LikesRepository { get; }
        Task<bool> Complete();
        bool HasChanges();
    }
}
