using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class LikesController(ILikeRepository likeRepository) : BaseApiController
    {
        [HttpPost("{targetMemberId}")]
        public async Task<ActionResult> ToggleLike(string targetMemberId)
        {
            var sourceMemberId = User.getmemberId();

            if (sourceMemberId == targetMemberId) return BadRequest("You cannot like yourself");

            var existingLike = await likeRepository.GetMemberLike(sourceMemberId, targetMemberId);

            if (existingLike == null)
            {
                var like = new Entities.MemberLike
                {
                    SourceMemberId = sourceMemberId,
                    TargetMemberId = targetMemberId
                };

                likeRepository.AddLike(like);
            }
            else
            {
                likeRepository.DeleteLike(existingLike);
            }

            if (await likeRepository.SaveAllAsync()) return Ok();
            return BadRequest("Failed to add like");
        }

        [HttpGet("list")]
        public async Task<ActionResult<IReadOnlyList<string>>> GetCurrentMemberLikeIds()
        {
            return Ok(await likeRepository.GetCurrentMemberLikeIds(User.getmemberId()));
        }

        [HttpGet]
        public async Task<ActionResult<PaginatedResult<Entities.Member>>> GetMembersLikes([FromQuery] LikesParams likesParams)
        {
            likesParams.MemberId = User.getmemberId();
            return Ok(await likeRepository.GetMembersLikes(likesParams));
        }
    }
}
