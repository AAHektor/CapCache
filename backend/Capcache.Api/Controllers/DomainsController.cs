using Capcache.Api.Dtos;
using Capcache.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Capcache.Api.Controllers;

[ApiController]
[Route("api/domains")]
public class DomainsController(DomainService domains) : ControllerBase
{
    [HttpGet]
    public async Task<List<DomainCountDto>> List(CancellationToken ct) => await domains.ListAsync(ct);
}
