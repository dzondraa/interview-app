using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CloudStorage.Repository
{
    public interface IMongoRepository<T>
    {
        public IEnumerable<T> GetAll();
        public Task Insert(T inertionRecord);
        Task BatchDelete(IEnumerable<Guid> idList);

    }
}
