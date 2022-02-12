using CloudStorage.Entities;
using CloudStorage.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CloudStorage.RepositoryImplementation
{
    public class CandidateRepository : AbstractMongoRepository<Candidate>
    {
        public CandidateRepository(IMongoProvider provider) : base(provider)
        {
            _collectionName = "Candidates";
        }
    }
}
