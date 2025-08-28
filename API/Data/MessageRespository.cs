using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    // Ensure you are using your actual DbContext class, not AppContext (which is a .NET type)
    public class MessageRespository(AppDbContext context) : IMessageRepository
    {
        public void AddMessage(Message message)
        {
            context.Messages.Add(message);
        }

        public void DeleteMessage(Message message)
        {
            context.Messages.Remove(message);
        }

        public async Task<Message?> GetMessage(string messageId)
        {
            return await context.Messages.FindAsync(messageId);
        }

        public Task<PaginatedResult<MessageDto>> GetMessagesForMember(MessageParams messageParams)
        {
            var query = context.Messages.OrderByDescending(x => x.MessageSent).AsQueryable();
            query = messageParams.Container switch
            {
                "Outbox" => query.Where(x => x.SenderId == messageParams.MemberId && !x.SenderDeleted),
                _ => query.Where(x => x.RecipientId == messageParams.MemberId && !x.RecipientDeleted && x.DateRead == null)
            };

            var messages = query.Select(MessageExtension.ToDtoProjection());
            return PaginationHelper.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
        }

        public async Task<IReadOnlyList<MessageDto>> GetMessageThread(string currentMemberId, string recipientId)
        {
            await context.Messages
                 .Where(m => m.RecipientId == currentMemberId && !m.RecipientDeleted && m.SenderId == recipientId && m.DateRead == null)
                 .ExecuteUpdateAsync(setters => setters.SetProperty(x => x.DateRead, DateTime.UtcNow));

            var messages = await context.Messages
                .Where(m => (m.RecipientId == currentMemberId && !m.RecipientDeleted && m.SenderId == recipientId) ||
                            (m.RecipientId == recipientId && !m.SenderDeleted && m.SenderId == currentMemberId))
                .OrderBy(m => m.MessageSent)
                .Select(MessageExtension.ToDtoProjection())
                .ToListAsync();

            return messages;
        }

        public async Task<bool> SaveAllAsync()
        {
            return await context.SaveChangesAsync() > 0;
        }
    }
}
