using System.Collections.Concurrent;

namespace API.SignalR
{
    public class PresenceTracker
    {
        private static readonly ConcurrentDictionary<string, ConcurrentDictionary<string, byte>> OnlineUsers = new();

        public Task<bool> UserConnected(string userName, string connectionId)
        {
            var isOnline = false;
            var connections = OnlineUsers.GetOrAdd(userName, _ => new ConcurrentDictionary<string, byte>());
            lock (connections)
            {
                connections.TryAdd(connectionId, 0);
                if (connections.Count == 1)
                {
                    isOnline = true;
                }
            }
            return Task.FromResult(isOnline);
        }

        public Task<bool> UserDisconnected(string userName, string connectionId)
        {
            var isOffline = false;
            if (OnlineUsers.TryGetValue(userName, out var connections))
            {
                lock (connections)
                {
                    connections.TryRemove(connectionId, out _);
                    if (connections.IsEmpty)
                    {
                        OnlineUsers.TryRemove(userName, out _);
                        isOffline = true;
                    }
                }
            }
            return Task.FromResult(isOffline);
        }

        public Task<string[]> GetOnlineUsers()
        {
            var onlineUsers = OnlineUsers.Keys.OrderBy(k => k).ToArray();
            return Task.FromResult(onlineUsers);
        }

        public static Task<List<string>> GetConnectionsForUser(string userId)
        {
            if (OnlineUsers.TryGetValue(userId, out var connections))
            {
                return Task.FromResult(connections.Keys.ToList());
            }

            return Task.FromResult(new List<string>());
        }
    }
}
