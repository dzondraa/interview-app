using CloudStorage.Repository;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CloudStorage.Entities
{
    public class Candidate : IMongoEntity
    {
        public string CandidateId { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; } 
        public IEnumerable<string> Skills { get; set; }
        public IEnumerable<Guid> Interview { get; set; } = null;
        public Guid Id { get; set; } = new Guid();
    }
}
