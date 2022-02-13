using CloudStorage.Dto.Requests;
using CloudStorage.Entities;
using CloudStorage.Helpers;
using CloudStorage.Repository;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CloudStorage.RepositoryImplementation
{
    public class InterviewRepository : AbstractMongoRepository<Interview>
    {
        public InterviewRepository(IMongoProvider db) : base(db)
        {
            _collectionName = "Interview";
        }

        public IEnumerable<object> getAllWithUser(InterviewFilter filter)
        {
            // To Do -> Do not retrive all the date, use Mongo drivere filters instead
            var interviews = mongoDB.GetClient().GetCollection<Interview>(_collectionName).AsQueryable();
            var candidates = mongoDB.GetClient().GetCollection<Candidate>("Candidates").AsQueryable();

            var query = from interview in interviews
                        join candidate in candidates on interview.Candidate equals candidate.CandidateId
                        select new InterviewCandidateResponse
                        {
                            Id = interview.Id,
                            Name = candidate.FullName,
                            Email = candidate.Email,
                            Skills = candidate.Skills,
                            Status = interview.Status,
                            Questions = interview.Questions,
                            Date = interview.Date
                        };
            var data =  query.ToList();
            return data.FilterByAreasAndStatus(filter);
        }

        public IEnumerable<object> getById(Guid id)
        {
            // To Do -> Improve query
            var interviews = mongoDB.GetClient().GetCollection<Interview>(_collectionName).AsQueryable();
            var questions = mongoDB.GetClient().GetCollection<Question>("Questions").AsQueryable();

            var data = interviews;
            List<object> result = new List<object>();
            var interview = interviews.Where(i => i.Id == id).FirstOrDefault();
            var questionsForInterview = new List<object>();
            foreach(Guid questionId in interview.Questions)
            {
                questionsForInterview.Add(questions.Where(q => q.Id == questionId).FirstOrDefault());
            }
            result.Add(new
            {
                Interview = interview,
                Questions = questionsForInterview
            });

            return result;
        }

        public async Task Patch(Guid id, Interview interviewRequest)
        {
            var interviews = mongoDB.GetClient().GetCollection<Interview>(_collectionName);
            var filter = Builders<Interview>.Filter.Eq(e => e.Id, id);
            var update = Builders<Interview>.Update.Set(i => i.Status, interviewRequest.Status);
            await interviews.UpdateOneAsync(filter, update);
        }

    }

    public class InterviewCandidateResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public IEnumerable<string> Skills { get; set; }
        public string Status { get; set; }
        public IEnumerable<Guid> Questions { get; set; }
        public DateTime Date { get; set; } 
    }
}
