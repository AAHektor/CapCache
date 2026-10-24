using Capcache.Api.Dtos;
using Capcache.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Capcache.Api.Controllers;

[ApiController]
[Route("api/screenshots")]
public class ScreenshotsController(ScreenshotService screenshots) : ControllerBase
{
    /// <summary>Newest first, one page at a time. Search and filters are query parameters.</summary>
    [HttpGet]
    public async Task<ActionResult<PagedResult<ScreenshotDto>>> List([FromQuery] ScreenshotQuery query, CancellationToken ct)
    {
        var page = await screenshots.ListAsync(query, ct);
        return page is null ? Problem("Invalid cursor.", statusCode: StatusCodes.Status400BadRequest) : page;
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ScreenshotDto>> Get(Guid id, CancellationToken ct) =>
        await screenshots.GetAsync(id, ct) is { } screenshot ? screenshot : NotFound();

    [HttpPatch("{id:guid}")]
    public async Task<ActionResult<ScreenshotDto>> Update(Guid id, UpdateScreenshotRequest request, CancellationToken ct) =>
        await screenshots.UpdateAsync(id, request, ct) is { } updated ? updated : NotFound();

    [HttpPut("{id:guid}/collection")]
    public async Task<ActionResult<ScreenshotDto>> Move(Guid id, MoveScreenshotRequest request, CancellationToken ct)
    {
        var (found, collectionFound, result) = await screenshots.MoveAsync(id, request.CollectionId, ct);
        if (!found) return NotFound();
        if (!collectionFound) return Problem("Collection not found.", statusCode: StatusCodes.Status400BadRequest);
        return result!;
    }

    /// <summary>Soft delete. Undo with POST {id}/restore.</summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct) =>
        await screenshots.DeleteAsync(id, ct) ? NoContent() : NotFound();

    [HttpPost("{id:guid}/restore")]
    public async Task<ActionResult<ScreenshotDto>> Restore(Guid id, CancellationToken ct) =>
        await screenshots.RestoreAsync(id, ct) is { } restored ? restored : NotFound();
}
