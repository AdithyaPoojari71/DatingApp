using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Text.RegularExpressions;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace API.SignalR
{
    [Authorize]
    public class MessageHub(IHubContext<PresenceHub> presenceHub, IMessageRepository messageRepository, IMemberRepository memberRepository) : Hub
    {
        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var otherUser = httpContext?.Request?.Query["userId"].ToString()
                ?? throw new HubException("Other user not found");
            var groupName = GetGroupName(GetUserId(), otherUser);
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            await AddToGroup(groupName);

            var messages = await messageRepository.GetMessageThread(GetUserId(), otherUser);

            await Clients.Group(groupName).SendAsync("ReceiveMessageThread", messages);
        }

        public async Task SendMessage(CreateMessageDto createMessageDto)
        {
            var sender = await memberRepository.GetMemberByIdAsync(GetUserId());
            var recipient = await memberRepository.GetMemberByIdAsync(createMessageDto.RecipientId);

            if (recipient == null || sender == null || sender.Id == createMessageDto.RecipientId)
                throw new HubException("Cannot send message");

            var message = new Message
            {
                SenderId = sender.Id,
                RecipientId = recipient.Id,
                Content = createMessageDto.Content
            };

            var groupName = GetGroupName(sender.Id, recipient.Id);
            var group = await messageRepository.GetMessageGroup(groupName);
            var userInGroup = group != null && group.Connections.Any(x =>
                 x.UserId == message.RecipientId);

            if (userInGroup)
            {
                message.DateRead = DateTime.UtcNow;
            }

            messageRepository.AddMessage(message);


            if (await messageRepository.SaveAllAsync())
            {
                await Clients.Group(groupName).SendAsync("NewMessage", message.ToDto());
                var connections = await PresenceTracker.GetConnectionsForUser(recipient.Id);
                if (connections != null && connections.Count > 0 && !userInGroup)
                {
                    await presenceHub.Clients.Clients(connections).SendAsync("NewMessageReceived", message.ToDto());
                }
            }
        }
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            await messageRepository.RemoveConnection(Context.ConnectionId);
            await base.OnDisconnectedAsync(exception);
        }

        private async Task<bool> AddToGroup(string groupName)
        {
            var group = await messageRepository.GetMessageGroup(groupName);
            var connection = new Entities.Connection(Context.ConnectionId, GetUserId());

            if (group == null)
            {
                group = new Entities.Group(groupName);
                messageRepository.AddGroup(group);
            }

            group.Connections.Add(connection);

            return await messageRepository.SaveAllAsync();
        }

        private static string GetGroupName(string? caller, string? other)
        {
            var stringCompare = string.CompareOrdinal(caller, other) < 0;
            return stringCompare ? $"{caller}-{other}" : $"{other}-{caller}";
        }

        private string GetUserId()
        {
            return Context.User?.getmemberId() ?? throw new Exception("Could not get user id - PresenceHub");

        }
    }
}
