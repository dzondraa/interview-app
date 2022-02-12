using CloudStorage.Entities;
using CloudStorage.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CloudStorage.RepositoryImplementation
{
    public class InterviewQuestionRepository : AbstractMongoRepository<InterviewQuestion>
    {
        public InterviewQuestionRepository(IMongoProvider db) : base(db)
        {
            _collectionName = "InterviewQuestion";
        }
    }
}
