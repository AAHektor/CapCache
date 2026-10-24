using Capcache.Api.Dtos;
using Capcache.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Capcache.Api.Controllers;

[ApiController]
[Route("api/collections")]
public class CollectionsController(CollectionService collections) : ControllerBase
{
    [HttpGet]
    public async Task<List<CollectionDto>> List(CancellationToken ct) => await collections.ListAsync(ct);

    [HttpPost]
    public async Task<ActionResult<CollectionDto>> Create(CreateCollectionRequest request, CancellationToken ct)
    {
        var created = await collections.CreateAsync(request, ct);
        return Created($"/api/collections/{created.Id}", created);
    }

    [HttpPatch("{id:guid}")]
    public async Task<ActionResult<CollectionDto>> Update(Guid id, UpdateCollectionRequest request, CancellationToken ct) =>
        await collections.UpdateAsync(id, request, ct) is { } updated ? updated : NotFound();

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct) =>
        await collections.DeleteAsync(id, ct) ? NoContent() : NotFound();
}
