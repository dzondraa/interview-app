using MongoDB.Driver;
using System;

namespace CloudStorage
{
    public class MongoDBConnection : IMongoProvider
    {
        public IMongoDatabase client;
        public MongoDBConnection()
        {
            client = this.GetClient();
        }

        public IMongoDatabase GetClient()
        {
            var settings = MongoClientSettings.FromConnectionString("mongodb+srv://dzondra:dzondra@cluster0.gg7b8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");
            var client = new MongoClient(settings);
            return client.GetDatabase("Documents");
        }

    }
}
