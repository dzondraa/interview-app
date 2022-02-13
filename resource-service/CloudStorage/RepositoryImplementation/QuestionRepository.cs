using CloudStorage.Entities;
using CloudStorage.Repository;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CloudStorage.RepositoryImplementation
{
    public class QuestionRepository: AbstractMongoRepository<Question>, IQuestionRepository
    {
        public QuestionRepository(IMongoProvider db) : base(db)
        {
            base._collectionName = "Questions";
        }
    
        public Question getByName(string name) 
            => mongoDB
                .GetClient()
                .GetCollection<Question>(_collectionName)
                .Find(question => question.Name == name)
                .FirstOrDefault();

        public IEnumerable<Question> GetAllByAreas(IEnumerable<Guid> area)
        {
            var questions = this.mongoDB.GetClient().GetCollection<Question>(_collectionName);
            var filter = Builders<Question>.Filter.AnyIn(q => q.Areas, area);
            return questions.Find(filter).ToList();
        }
    }
}
