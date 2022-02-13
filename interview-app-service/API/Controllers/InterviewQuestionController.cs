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
    public class InterviewQuestionController : ControllerBase
    {
        // GET: api/<InterviewQuestionController>
        [HttpGet]
        public IActionResult Get([FromServices] InterviewQuestionRepository repository)
        {
            return Ok(repository.GetAll());
        }

        // GET api/<InterviewQuestionController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<InterviewQuestionController>
        [HttpPost]
        public async Task Post([FromBody] InterviewQuestion newInterviewQuestion, [FromServices] InterviewQuestionRepository repository)
        {
            await repository.Insert(newInterviewQuestion);
        }

        // PUT api/<InterviewQuestionController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<InterviewQuestionController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
