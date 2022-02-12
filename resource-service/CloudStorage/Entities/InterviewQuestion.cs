using CloudStorage.Repository;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CloudStorage.Entities
{

    public class InterviewQuestion : IMongoEntity
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid InterviewID { get; set; }
        public Guid QuestionID { get; set; }
        public int Score { get; set; }
        public string Comment { get; set; }
    }
}
