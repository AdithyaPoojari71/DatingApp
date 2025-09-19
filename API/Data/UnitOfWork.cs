using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class UnitOfWork(AppDbContext appDbContext) : IUnitOfWork
    {
        private IMemberRepository? _memberRepository;
        private IMessageRepository? _messageRepository;
        private ILikeRepository? _likeRepository;
        private IPhotoRepository? _photoRepository;

        public IMemberRepository MemberRepository => _memberRepository ??= new MemberRepository(appDbContext);

        public IMessageRepository MessageRepository => _messageRepository ??= new MessageRespository(appDbContext);

        public ILikeRepository LikesRepository => _likeRepository ??= new LikesRepository(appDbContext);
        public IPhotoRepository PhotoRepository => _photoRepository ??= new PhotoRepository(appDbContext);


        public async Task<bool> Complete()
        {

            try
            {
                return await appDbContext.SaveChangesAsync() > 0;
            }
            catch (DbUpdateException ex)
            {
                throw new Exception("An error occurred while saving changes to the database.", ex);
            }
        }

        public bool HasChanges()
        {
            return appDbContext.ChangeTracker.HasChanges();
        }
    }
}
