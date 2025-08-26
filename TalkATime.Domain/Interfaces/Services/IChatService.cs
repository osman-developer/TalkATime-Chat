using System;

namespace TalkATime.Domain.Interfaces.Services
{
    public interface IChatService
    {
        bool AddUserToList(string user);
        void AddUserConnectionId(string user, string connectionId);
        string GetUserByConnectionId(string connectionId);
        string GetConnectionIdByUser(string user);
        void RemoveUserFromList(string user);
        string[] GetOnlineUsers();
    }
}
