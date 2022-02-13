using CloudStorage.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CloudStorage.Dto.Requests
{

    public class CreateInterviewRequest
    {
        public string CandidateId { get; set; }
        public DateTime Date = DateTime.Now;
        public string Status { get; set; } = "Planned";
        public IEnumerable<Guid> Questions { get; set; }
        public string Feedback { get; set; } = "";

    }
}
