using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class MembersController : BaseApiController
    {
        private readonly AppDbContext _context;

        public MembersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<AppUser>>> GetMembers()
        {
            var members = await _context.Users.ToArrayAsync();
            return Ok(members);
        }

        //[AllowAnonymous] // it will allow to access without token
        [HttpGet("{id}")]
        public ActionResult<AppUser> GetMember(string id)
        {
            var member = _context.Users.Find(id);
            if (member == null) return NotFound();
            return Ok(member);
        }
    }
}
