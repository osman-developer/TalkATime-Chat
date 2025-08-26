// TalkATime.Domain/DTO/Message/MessageDTO.cs
using System.ComponentModel.DataAnnotations;

namespace TalkATime.Domain.DTO.Message;

public class MessageDTO
{
    [Required, StringLength(1000)]
    public string Content { get; set; } = string.Empty;

    public string From { get; set; } = string.Empty;
    public string? To { get; set; } = string.Empty;

    public DateTime SentAtUtc { get; set; } = DateTime.UtcNow;
}
