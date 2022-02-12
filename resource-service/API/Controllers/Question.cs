using CloudStorage.Dto.Requests;
using CloudStorage.Repository;
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
    public class Question : ControllerBase
    {
        //GET: api/<Question>
        [HttpGet]
        public IEnumerable<IMongoEntity> Get([FromServices] QuestionRepository repository)
        {
            return repository.GetAll();
        }

        //// GET api/<Question>/5
        //[HttpGet("{id}")]
        //public string Get(int id)
        //{
        //    return "value";
        //}

        // POST api/<Question>
        [HttpPost]
        public async Task<IActionResult> Post(
            [FromBody] NewQuestionRequest questionRequest, 
            [FromServices] QuestionRepository repository)
        {
            await repository.Insert(new CloudStorage.Entities.Question(questionRequest));
            return Ok(repository.getByName(questionRequest.Name));
        }

        //// PUT api/<Question>/5
        //[HttpPut("{id}")]
        //public void Put(int id, [FromBody] string value)
        //{
        //}

        //// DELETE api/<Question>/5
        //[HttpDelete("{id}")]
        //public void Delete(int id)
        //{
        //}
    }

}
