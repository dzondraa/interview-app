using API.Dto;
using API.Extensions;
using CloudStorage.Dto.Requests;
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
    public class Interview : ControllerBase
    {
        // GET: api/<Interview>
        [HttpGet]
        public object Get([FromServices] InterviewRepository repository, [FromQuery] InterviewFilter filter)
        {
            //return repository.GetAll().EnsurePagedResponse();
            return repository.getAllWithUser(filter).EnsurePagedResponse();
        }

        // GET api/<Interview>/5
        [HttpGet("{id}")]
        public IActionResult Get(Guid id, [FromServices] InterviewRepository repository)
        {
            return Ok(repository.getById(id));
        }

        // POST api/<Interview>
        [HttpPost]
        public async Task Post([FromBody] CreateInterviewRequest newInterviewReq, [FromServices] InterviewRepository repository)
        {
            await repository.Insert(new CloudStorage.Entities.Interview(newInterviewReq));
        }

        // PUT api/<Interview>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<Interview>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }

   
}
