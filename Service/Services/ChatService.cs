using System;
using System.Collections.Concurrent;
using System.Linq;
using TalkATime.Domain.Interfaces.Services;

namespace TalkATime.Service.Services
{
    public class ChatService : IChatService
    {
        // Thread-safe, case-insensitive dictionary for users
        private static readonly ConcurrentDictionary<string, string?> Users =
            new(StringComparer.OrdinalIgnoreCase);

        public bool AddUserToList(string user)
        {
            if (string.IsNullOrWhiteSpace(user))
                return false;

            return Users.TryAdd(user.Trim(), null);
        }

        public void AddUserConnectionId(string user, string connectionId)
        {
            if (string.IsNullOrWhiteSpace(user) || string.IsNullOrWhiteSpace(connectionId))
                return;

            Users.AddOrUpdate(user.Trim(), connectionId, (_, __) => connectionId);
        }

        public string? GetUserByConnectionId(string connectionId)
        {
            if (string.IsNullOrWhiteSpace(connectionId))
                return null;

            return Users.FirstOrDefault(x => x.Value == connectionId).Key;
        }

        public string? GetConnectionIdByUser(string user)
        {
            if (string.IsNullOrWhiteSpace(user))
                return null;

            Users.TryGetValue(user.Trim(), out var connectionId);
            return connectionId;
        }

        public void RemoveUserFromList(string user)
        {
            if (string.IsNullOrWhiteSpace(user))
                return;

            Users.TryRemove(user.Trim(), out _);
        }

        public string[] GetOnlineUsers()
        {
            return Users.Keys.OrderBy(x => x).ToArray();
        }
    }
}

