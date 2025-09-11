using API.Entities;

namespace API.Interfaces
{
    public interface ITokenService
    {
        Task<string> GetToken(AppUser user);
        string GenerateRefreshToken();
    }
}
