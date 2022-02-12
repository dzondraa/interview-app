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
    public class Interview : IMongoEntity
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Candidate { get; set; }
        public DateTime Date { get; set; }
        public string Status { get; set; }
        public IEnumerable<Guid> Questions { get; set; }
        public string Feedback { get; set; }

        public Interview(CreateInterviewRequest newInterviewReq)
        {
            Candidate = newInterviewReq.CandidateId;
            Date = newInterviewReq.Date;
            Status = newInterviewReq.Status;
            Questions = newInterviewReq.Questions;
            Feedback = newInterviewReq.Feedback;
        }
    }
}
