using CloudStorage.Dto.Requests;
using CloudStorage.Repository;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CloudStorage.Entities
{
    public class Question : IMongoEntity
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; }
        public string Description { get; set; }
        public IEnumerable<Guid> Areas { get; set; }

        public Question(NewQuestionRequest request) 
        {
            Name = request.Name;
            Description = request.Description;
            Areas = request.Areas;
        }
    }
}
