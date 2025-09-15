using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class LikesController(IUnitOfWork uow) : BaseApiController
    {
        [HttpPost("{targetMemberId}")]
        public async Task<ActionResult> ToggleLike(string targetMemberId)
        {
            var sourceMemberId = User.getmemberId();

            if (sourceMemberId == targetMemberId) return BadRequest("You cannot like yourself");

            var existingLike = await uow.LikesRepository.GetMemberLike(sourceMemberId, targetMemberId);

            if (existingLike == null)
            {
                var like = new Entities.MemberLike
                {
                    SourceMemberId = sourceMemberId,
                    TargetMemberId = targetMemberId
                };

                uow.LikesRepository.AddLike(like);
            }
            else
            {
                uow.LikesRepository.DeleteLike(existingLike);
            }

            if (await uow.LikesRepository.SaveAllAsync()) return Ok();
            return BadRequest("Failed to add like");
        }

        [HttpGet("list")]
        public async Task<ActionResult<IReadOnlyList<string>>> GetCurrentMemberLikeIds()
        {
            return Ok(await uow.LikesRepository.GetCurrentMemberLikeIds(User.getmemberId()));
        }

        [HttpGet]
        public async Task<ActionResult<PaginatedResult<Entities.Member>>> GetMembersLikes([FromQuery] LikesParams likesParams)
        {
            likesParams.MemberId = User.getmemberId();
            return Ok(await uow.LikesRepository.GetMembersLikes(likesParams));
        }
    }
}
