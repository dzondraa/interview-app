using CloudStorage.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CloudStorage.Entities
{
    public class InterviewHistory : IMongoEntity
    {
        public Guid Id { get; set; }
        public Guid interviewId { get; set; }
        public IEnumerable<QuestionDTO> answers { get; set; }
    }

    public class QuestionDTO
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string name { get; set; }
        public string description { get; set; }
        public string answer { get; set; }
        public IEnumerable<Guid> areas { get; set; }
    }
}
