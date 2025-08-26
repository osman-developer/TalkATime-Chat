using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TalkATime.Domain.DTO.User;
using TalkATime.Domain.Interfaces.Services;
using TalkATime.Service.Services;

namespace TalkATime.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;

        public ChatController(IChatService chatService)
        {
            _chatService = chatService;
        }
        [HttpPost("register-user")]
        public IActionResult Register(AddUserDTO user)
        {
           if(_chatService.AddUserToList(user.Name))
            {
                return Ok();
            }

            return BadRequest("This name is already taken ..");
        }
    }
}
