using API.Data;

namespace API.Interfaces
{
    public interface IUnitOfWork
    {
        IMemberRepository MemberRepository { get; }
        IMessageRepository MessageRepository { get; }
        ILikeRepository LikesRepository { get; }
        IPhotoRepository PhotoRepository { get; }
        Task<bool> Complete();
        bool HasChanges();
    }
}
