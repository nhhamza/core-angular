using System;
using System.Collections;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IDatingRepository repo;
        private readonly IMapper mapper;

        public UsersController(IDatingRepository repo, IMapper mapper)
        {
            this.repo = repo;
            this.mapper = mapper;
        }

        public async Task<IActionResult> GetUsers()
        {
            var users = await this.repo.GetUsers();
            var userDtos = this.mapper.Map<IEnumerable<UserForListDto>>(users);
            return Ok(userDtos);
        }

        [HttpGet("{id}", Name = "GetUser")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await this.repo.GetUser(id);
            var userDto = this.mapper.Map<UserForDetailedDto>(user);
            return Ok(userDto);
        }

         [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserForUpdateDto userForUpdateDto)
        {
            if(id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }
             var userFromRepo = await this.repo.GetUser(id);
            this.mapper.Map(userForUpdateDto,userFromRepo);
   
            if(await this.repo.SaveAll()){
                return NoContent();
                
            }
            
             throw new Exception($"Updating user {id} failed on save");
        }
    }
}