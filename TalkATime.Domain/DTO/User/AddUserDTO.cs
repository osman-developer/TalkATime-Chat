// TalkATime.Domain/DTO/User/AddUserDTO.cs
using System.ComponentModel.DataAnnotations;

namespace TalkATime.Domain.DTO.User;

public class AddUserDTO
{
    [Required, StringLength(15, MinimumLength = 3,
        ErrorMessage = "Name must be between {2} and {1} characters.")]
    public string Name { get; set; } = string.Empty;
}
