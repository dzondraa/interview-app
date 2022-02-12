using API.Extensions;
using CloudStorage.Entities;
using CloudStorage.RepositoryImplementation;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CandidateController : ControllerBase
    {
        // GET: api/<CandidateController>
        [HttpGet]
        public IActionResult Get([FromServices] CandidateRepository repository)
        {
            return Ok(repository.GetAll().EnsurePagedResponse());
        }

        // GET api/<CandidateController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<CandidateController>
        [HttpPost]
        public async Task Post([FromBody] Candidate newCandidate, [FromServices] CandidateRepository repository)
        {
            newCandidate.Id = Guid.NewGuid();
            await repository.Insert(newCandidate);
        }

        // PUT api/<CandidateController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<CandidateController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
