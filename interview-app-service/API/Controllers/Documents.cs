using API.Dto.Search;
using API.Extensions;
using BusinessLayer;
using BusinessLayer.Servces;
using CloudStorage;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Documents : ControllerBase
    {
        // GET: api/<Documents>
        [HttpGet]
        public IActionResult Get([FromServices] IDocService docService, [FromQuery] DocumentSearch searchContext)
        {
            return Ok(docService
                .RunThroughFolders(searchContext.Path, searchContext.Keyword, searchContext.TargetMatch)
                .EnsurePagedResponse()
                );
        }

        // GET: api/<Documents>/single
        [HttpGet("single")]
        public IActionResult GetSignle([FromServices] IDocExtractor extractor, [FromQuery] string path)
        {
            return Ok(extractor.ExtractSections(path));
        }

        // GET api/<Documents>/5
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            return BadRequest();
        }

        

        // POST api/<Documents>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<Documents>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<Documents>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }

    }
}
