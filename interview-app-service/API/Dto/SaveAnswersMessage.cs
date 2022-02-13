using CloudStorage.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Dto
{
    public class SaveAnswersMessage
    {
        public Guid Id { get; set; }
        public Guid interviewId { get; set; }
        public IEnumerable<QuestionDTO> answers { get; set; }
        public SaveAnswersMessage(Guid interviewId, IEnumerable<QuestionDTO> answers)
        {
            this.interviewId = interviewId;
            this.answers = answers;
        }
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
