using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class DatingRepository : IDatingRepository
    {
        private readonly DataContext context;

        public DatingRepository(DataContext context)
        {
            this.context = context;
        }
        public void Add<T>(T entity) where T : class
        {
            this.context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            this.context.Remove(entity);
        }

        public async Task<Photo> GetPhoto(int id)
        {
            return await this.context.Photos.SingleOrDefaultAsync(p => p.Id == id);
        }
        public async Task<Photo> GetMainPhotoForUser(int userId)
        {
            return await this.context.Photos.Where(p => p.UserId == userId).SingleOrDefaultAsync(p => p.IsMain);
        }

        public async Task<User> GetUser(int id)
        {
            var user = this.context.Users.Include(x => x.Photos).SingleOrDefaultAsync(x => x.Id == id);
            return await user;            
        }

        public async  Task<PagedList<User>> GetUsers(UserParams userParams)
        {
             var users = this.context.Users.Include(x => x.Photos)
             .OrderByDescending(u => u.LastActive).AsQueryable();

             users = users.Where(u => u.Id != userParams.UserId );
             users = users.Where(u => u.Gender == userParams.Gender);

             if (userParams.MinAge != 18 || userParams.MaxAge != 99)
             {
                 var minDob = DateTime.Today.AddYears(-userParams.MaxAge - 1);
                 var maxDob = DateTime.Today.AddYears(-userParams.MinAge);
                 users = users.Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob);
             }

            if (!string.IsNullOrEmpty(userParams.OrderBy))
            {
                switch (userParams.OrderBy)
                {
                    case "created":
                        users = users.OrderByDescending(u => u.Created);
                        break;

                    default:
                        users = users.OrderByDescending(u => u.LastActive);
                        break;
                }
            }

            return await PagedList<User>.CreateASync(users,userParams.PageNumber, userParams.PageSize);
            
        }

        public async Task<bool> SaveAll()
        {
            return await this.context.SaveChangesAsync() > 0;
        }
    }
}