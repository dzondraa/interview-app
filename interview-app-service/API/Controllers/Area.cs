using CloudStorage;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class Area : ControllerBase
    {
        // GET: api/<Area>
        [HttpGet]
        public async Task<IActionResult> GetAsync([FromServices] Areas areas)
        {

            return Ok(areas.getAll().EnsurePrettyRespones());
        }
        // POST: api/<Area>
        [HttpPost]
        public async Task<IActionResult> 
            Post([FromServices] Areas areas, 
            [FromBody] CreateAreaRequest areaRequest)
                => Ok(await areas.InsertNew(areaRequest));

        // GET: api/<Area>
        [HttpPost("batchdelete")]
        public async Task<IActionResult> 
            BatchDelete([FromBody] IEnumerable<Guid> idList,
            [FromServices] Areas areas)
        {
            await areas.BatchDelete(idList);
            return Ok(idList);
        }
    }
}
