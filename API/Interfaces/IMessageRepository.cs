using API.DTOs;
using API.Entities;
using API.Helpers;
using System.Text.RegularExpressions;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace API.Interfaces
{
    public interface IMessageRepository
    {
        void AddMessage(Message message);
        void DeleteMessage(Message message);
        Task<Message?> GetMessage(string messageId);
        Task<PaginatedResult<MessageDto>> GetMessagesForMember(MessageParams messageParams);
        Task<IReadOnlyList<MessageDto>> GetMessageThread(string currentMemberId, string recipientId);

        Task<bool> SaveAllAsync();
        void AddGroup(Entities.Group group);
        Task RemoveConnection(string connectionId);
        Task<Entities.Connection?> GetConnection(string connectionId);
        Task<Entities.Group?> GetMessageGroup(string groupName);
        Task<Entities.Group?> GetGroupForConnection(string connectionId);
        Task<int> GetUnreadCountAsync(string userId);


    }
}
