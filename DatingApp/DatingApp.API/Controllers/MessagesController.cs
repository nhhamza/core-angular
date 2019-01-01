using System;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers {
    [ServiceFilter (typeof (LogUserActivity))]
    [Authorize]
    [Route ("api/users/{userId}/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase {
        private readonly IDatingRepository repo;
        private readonly IMapper mapper;
        public MessagesController (IDatingRepository repo, IMapper mapper) {
            this.repo = repo;
            this.mapper = mapper;
        }

        [HttpGet ("{id}", Name = "GetMessage")]
        public async Task<IActionResult> GetMessage (int userId, int id) {

            if (userId != int.Parse (User.FindFirst (ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized ();
            }

            var messageFromRepo = await this.repo.GetMessage (id);

            if (messageFromRepo == null) {
                return NotFound ();
            }

            return Ok (messageFromRepo);
        }

        [HttpPost]
        public async Task<IActionResult> CreateMessage (int userId, MessageForCreationDto messageForCreationDto) {

            if (userId != int.Parse (User.FindFirst (ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized ();
            }

            messageForCreationDto.SenderId = userId;
            var recipient = await this.repo.GetUser(messageForCreationDto.RecipienteId);

            if (recipient == null)
            {
                return BadRequest("Could not found user");
            }

            var message = this.mapper.Map<Message>(messageForCreationDto);

            this.repo.Add<Message>(message);

            if (await this.repo.SaveAll())
            {
                var messageToReturn = this.mapper.Map<MessageForCreationDto>(message);
                return CreatedAtRoute("GetMessage", new { id = message.Id}, messageToReturn);
            }

            throw new Exception("Creation the massage failed on save");
        }
    }

}