using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data {
    public class DatingRepository : IDatingRepository {
        private readonly DataContext context;

        public DatingRepository (DataContext context) {
            this.context = context;
        }
        public void Add<T> (T entity) where T : class {
            this.context.Add (entity);
        }

        public void Delete<T> (T entity) where T : class {
            this.context.Remove (entity);
        }

        public async Task<Photo> GetPhoto (int id) {
            return await this.context.Photos.SingleOrDefaultAsync (p => p.Id == id);
        }
        public async Task<Photo> GetMainPhotoForUser (int userId) {
            return await this.context.Photos.Where (p => p.UserId == userId).SingleOrDefaultAsync (p => p.IsMain);
        }

        public async Task<User> GetUser (int id) {
            var user = this.context.Users.Include (x => x.Photos).SingleOrDefaultAsync (x => x.Id == id);
            return await user;
        }

        public async Task<PagedList<User>> GetUsers (UserParams userParams) {
            var users = this.context.Users.Include (x => x.Photos)
                .OrderByDescending (u => u.LastActive).AsQueryable ();

            users = users.Where (u => u.Id != userParams.UserId);
            users = users.Where (u => u.Gender == userParams.Gender);

            if (userParams.Likers) {
                var userLikers = await this.GetUserLikes(userParams.UserId ,true);
                users = users.Where(u => userLikers.Contains(u.Id));
            }

            if (userParams.Likees) {
                var userLikees = await this.GetUserLikes(userParams.UserId ,false);
                users = users.Where(u => userLikees.Contains(u.Id));
            }

            if (userParams.MinAge != 18 || userParams.MaxAge != 99) {
                var minDob = DateTime.Today.AddYears (-userParams.MaxAge - 1);
                var maxDob = DateTime.Today.AddYears (-userParams.MinAge);
                users = users.Where (u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob);
            }

            if (!string.IsNullOrEmpty (userParams.OrderBy)) {
                switch (userParams.OrderBy) {
                    case "created":
                        users = users.OrderByDescending (u => u.Created);
                        break;

                    default:
                        users = users.OrderByDescending (u => u.LastActive);
                        break;
                }
            }

            return await PagedList<User>.CreateASync (users, userParams.PageNumber, userParams.PageSize);

        }

        private async Task<IEnumerable<int>> GetUserLikes (int id, bool likers) {

            var user = await this.context.Users.Include(x => x.Likers).Include(x => x.Likees).FirstOrDefaultAsync(u => u.Id == id);

            if (likers)
            {
                return user.Likers.Where(u => u.LikeeId == id).Select(x => x.LikerId);
            }
            else{
                return user.Likees.Where(u => u.LikerId == id).Select(x => x.LikeeId);
            }
        }
        public async Task<bool> SaveAll () {
            return await this.context.SaveChangesAsync () > 0;
        }

        public async Task<Like> GetLike (int userId, int recipienteId) {
            return await this.context.Likes.FirstOrDefaultAsync (u => u.LikerId == userId && u.LikeeId == recipienteId);
        }

        public async Task<Message> GetMessage(int id)
        {
            return await this.context.Messages.FirstOrDefaultAsync(m => m.Id == id);
        }

        public Task<PagedList<Message>> GetMessageForUser()
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<Message>> GetMessageThread(int userId, int recipienteId)
        {
            throw new NotImplementedException();
        }
    }
}