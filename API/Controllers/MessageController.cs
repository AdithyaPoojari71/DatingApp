using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class MessageController(IUnitOfWork uow) : BaseApiController
    {
        [HttpPost]
        public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto)
        {
            var sender = await uow.MemberRepository.GetMemberByIdAsync(User.getmemberId());
            var recipient = await uow.MemberRepository.GetMemberByIdAsync(createMessageDto.RecipientId);

            if (recipient == null || sender == null || sender.Id == createMessageDto.RecipientId)
                return BadRequest("Failed to send message");

            var message = new Message
            {
                SenderId = sender.Id,
                RecipientId = recipient.Id,
                Content = createMessageDto.Content
            };

            uow.MessageRepository.AddMessage(message);

            if (await uow.MessageRepository.SaveAllAsync()) return Ok(message.ToDto());
            return BadRequest("Failed to send message");
        }

        [HttpGet]
        public async Task<ActionResult<PaginatedResult<MessageDto>>> GetMessagesByContainer([FromQuery] MessageParams messageParams)
        {
            messageParams.MemberId = User.getmemberId();
            return Ok(await uow.MessageRepository.GetMessagesForMember(messageParams));
        }

        [HttpGet("thread/{recipientId}")]
        public async Task<ActionResult<IReadOnlyList<MessageDto>>> GetMessageThread(string recipientId)
        {
            var currentMemberId = User.getmemberId();
            return Ok(await uow.MessageRepository.GetMessageThread(currentMemberId, recipientId));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(string id)
        {
            var memberId = User.getmemberId();
            var message = await uow.MessageRepository.GetMessage(id);
            if (message == null) return NotFound();
            if (message.SenderId != memberId && message.RecipientId != memberId)
                return Unauthorized();
            if (message.SenderId == memberId) message.SenderDeleted = true;
            if (message.RecipientId == memberId) message.RecipientDeleted = true;
            if (message.SenderDeleted && message.RecipientDeleted)
                uow.MessageRepository.DeleteMessage(message);
            if (await uow.Complete()) return Ok();
            return BadRequest("Problem deleting the message");
        }

        [HttpGet("unread-count")]
        public async Task<ActionResult<int>> GetUnreadCount()
        {
            var memberId = User.getmemberId();
            var count = await uow.MessageRepository.GetUnreadCountAsync(memberId);
            return Ok(count);
        }
    }
}
