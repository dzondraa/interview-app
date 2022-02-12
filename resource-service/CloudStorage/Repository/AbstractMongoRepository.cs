using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CloudStorage.Repository
{
    public class AbstractMongoRepository<T> : IMongoRepository<T> where T : IMongoEntity
    {
        private protected readonly IMongoProvider mongoDB;
        private protected string _collectionName;

        public AbstractMongoRepository(IMongoProvider mongoDB)
        {
            this.mongoDB = mongoDB;
        }

        public async Task BatchDelete(IEnumerable<Guid> idList)
        {
            foreach (Guid id in idList)
                await mongoDB.GetClient().GetCollection<T>(_collectionName).DeleteOneAsync(entity => entity.Id == id);
        }

        public IEnumerable<T> GetAll()
        {
            return mongoDB.GetClient().GetCollection<T>(_collectionName).Find(_ => true).ToList();
        }

        public async Task Insert(T inertionRecord)
        {
            await mongoDB.GetClient().GetCollection<T>(_collectionName).InsertOneAsync(inertionRecord);
            //return mongoDB.GetClient().GetCollection<Area>("DocumentsCV").Find(area => area.name == insertionArea.name).FirstOrDefault().ToDtoResponse();
        }
    }
}
