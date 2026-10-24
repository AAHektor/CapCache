namespace Capcache.Api.Services;

/// <summary>
/// Stand-in until GitHub OAuth exists (stage 4). Every request is the same fixed user.
/// Only registered in the Development environment.
/// </summary>
public class DevCurrentUser : ICurrentUser
{
    public static readonly Guid DevUserId = new("00000000-0000-0000-0000-00000000dec0");

    public Guid UserId => DevUserId;
}
