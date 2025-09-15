using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace API.SignalR
{
    [Authorize]
    public class PresenceHub(PresenceTracker presenceTracker) : Hub
    {
        public override async Task OnConnectedAsync()
        {
            await presenceTracker.UserConnected(GetUserId(), Context.ConnectionId);

            await Clients.Others.SendAsync("UserIsOnline", GetUserId());

            var currentUsers = await presenceTracker.GetOnlineUsers();
            await Clients.Caller.SendAsync("GetOnlineUsers", currentUsers);

        }
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            await presenceTracker.UserDisconnected(GetUserId(), Context.ConnectionId);
            await Clients.Others.SendAsync("UserIsOffline", GetUserId());

            var currentUsers = await presenceTracker.GetOnlineUsers();
            await Clients.Caller.SendAsync("GetOnlineUsers", currentUsers);

            await base.OnDisconnectedAsync(exception);
        }

        private string GetUserId()
        {
            return Context.User?.getmemberId() ?? throw new Exception("Could not get user id - PresenceHub");
        }
    }
}
