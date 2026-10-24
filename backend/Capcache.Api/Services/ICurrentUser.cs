namespace Capcache.Api.Services;

/// <summary>The signed-in user of the current request.</summary>
public interface ICurrentUser
{
    Guid UserId { get; }
}
