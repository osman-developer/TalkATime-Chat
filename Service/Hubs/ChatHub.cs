
using Microsoft.AspNetCore.SignalR;
using TalkATime.Domain.DTO.Message;
using TalkATime.Domain.Interfaces.Services;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using TalkATime.Domain.Settings;

namespace TalkATime.Service.Hubs
{
    public class ChatHub : Hub
    {
        private readonly IChatService _chatService;
        private readonly ILogger<ChatHub> _logger;
        private readonly string _globalGroup;


        public ChatHub(IChatService chatService, ILogger<ChatHub> logger, IOptions<ChatSettings> chatSettings)
        {
            _chatService = chatService ?? throw new ArgumentNullException(nameof(chatService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _globalGroup = chatSettings.Value.GlobalGroupName
                              ?? throw new ArgumentNullException(nameof(chatSettings.Value.GlobalGroupName));
        }

        #region Connection Lifecycle

        public override async Task OnConnectedAsync()
        {
            _logger.LogInformation("Client connected: {ConnectionId}", Context.ConnectionId);

            await Groups.AddToGroupAsync(Context.ConnectionId, _globalGroup)
                        .ContinueWith(_ => Clients.Caller.SendAsync("UserConnected"));

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            _logger.LogInformation("Client disconnected: {ConnectionId}, Error: {Error}",
                Context.ConnectionId, exception?.Message);

            await Groups.RemoveFromGroupAsync(Context.ConnectionId, _globalGroup);

            if (_chatService.GetUserByConnectionId(Context.ConnectionId) is { } user)
            {
                _chatService.RemoveUserFromList(user);
                await BroadcastOnlineUsers();
            }

            await base.OnDisconnectedAsync(exception);
        }

        #endregion

        #region Public Chat

        public Task ReceiveMessage(MessageDTO? message)
        {
            if (string.IsNullOrWhiteSpace(message?.Content))
                return Task.CompletedTask;

            _logger.LogDebug("Broadcast message from {User}", message.From);

            return Clients.Group(_globalGroup).SendAsync("NewMessage", message);
        }

        #endregion

        #region Private Chat

        public async Task CreatePrivateChat(MessageDTO? message)
        {
            if (string.IsNullOrWhiteSpace(message?.To))
                return;

            var privateGroup = GetPrivateGroupName(message.From, message.To);
            await Groups.AddToGroupAsync(Context.ConnectionId, privateGroup);

            if (_chatService.GetConnectionIdByUser(message.To) is { } toConnectionId)
            {
                await Groups.AddToGroupAsync(toConnectionId, privateGroup);

                _logger.LogInformation("Private chat created: {From} <-> {To}", message.From, message.To);

                await Clients.Client(toConnectionId).SendAsync("OpenPrivateChat", message);
            }
        }

        public Task ReceivePrivateMessage(MessageDTO? message)
        {
            if (string.IsNullOrWhiteSpace(message?.To))
                return Task.CompletedTask;

            var privateGroup = GetPrivateGroupName(message.From, message.To);

            _logger.LogDebug("Private message {From} -> {To}", message.From, message.To);

            return Clients.Group(privateGroup).SendAsync("NewPrivateMessage", message);
        }

        public async Task RemovePrivateChat(string from, string to)
        {
            if (string.IsNullOrWhiteSpace(from) || string.IsNullOrWhiteSpace(to))
                return;

            var privateGroup = GetPrivateGroupName(from, to);

            await Clients.Group(privateGroup).SendAsync("ClosePrivateChat");
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, privateGroup);

            if (_chatService.GetConnectionIdByUser(to) is { } toConnectionId)
            {
                await Groups.RemoveFromGroupAsync(toConnectionId, privateGroup);
            }

            _logger.LogInformation("Private chat removed: {From} <-> {To}", from, to);
        }

        #endregion

        #region User Management

        public async Task AddUserConnectionId(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return;

            _chatService.AddUserConnectionId(name, Context.ConnectionId);

            _logger.LogInformation("User {User} added with connection {ConnectionId}", name, Context.ConnectionId);

            await BroadcastOnlineUsers();
        }

        private Task BroadcastOnlineUsers()
        {
            var onlineUsers = _chatService.GetOnlineUsers();
            return Clients.Group(_globalGroup).SendAsync("OnlineUsers", onlineUsers);
        }

        #endregion

        #region Helpers

        private static string GetPrivateGroupName(string from, string to) =>
            string.IsNullOrWhiteSpace(from) || string.IsNullOrWhiteSpace(to)
                ? string.Empty
                : string.CompareOrdinal(from, to) < 0
                    ? $"{from}-{to}"
                    : $"{to}-{from}";

        #endregion
    }
}

