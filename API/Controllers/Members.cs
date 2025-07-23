using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // Matches: api/members
    public class MembersController : ControllerBase
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

        [HttpGet("{id}")]
        public ActionResult<AppUser> GetMember(string id)
        {
            var member = _context.Users.Find(id);
            if (member == null) return NotFound();
            return Ok(member);
        }
    }
}
