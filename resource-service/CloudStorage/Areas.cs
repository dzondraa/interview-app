using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CloudStorage
{
    public class Areas : IAreas
    {
        private readonly IMongoProvider mongoDB;

        public Areas(IMongoProvider mongoDB)
        {
            this.mongoDB = mongoDB;
        }

        public List<Area> getAll()
        {
            return mongoDB.GetClient().GetCollection<Area>("DocumentsCV").Find(_ => true).ToList();
        }

        public async Task<AreaResponse> InsertNew(CreateAreaRequest areaRequest)
        {
            var insertionArea = new Area(areaRequest);
            await mongoDB.GetClient().GetCollection<Area>("DocumentsCV").InsertOneAsync(insertionArea);
            return mongoDB.GetClient().GetCollection<Area>("DocumentsCV").Find(area => area.name == insertionArea.name).FirstOrDefault().ToDtoResponse();
        }

        public async Task BatchDelete(IEnumerable<Guid> idList)
        {
            foreach (Guid  id in idList)
                await mongoDB.GetClient().GetCollection<Area>("DocumentsCV").DeleteOneAsync(area => area.Id == id);   
        }


    }

    public class Area
    {
        public Guid Id { get; set; }
        public string name { get; set; }
        public Guid? parent { get; set; }

        public Area(CreateAreaRequest areaRequest)
        {
            Id = Guid.NewGuid();
            name = areaRequest.Name;
            parent = areaRequest.Parent;
        }

        public AreaResponse ToDtoResponse() => new AreaResponse(Id, name, parent);


    }

    public class AggregatedArea
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public List<AggregatedArea> subareas { get; set; }
        public Guid? Parent { get; set; }
    }

    public class CreateAreaRequest
    {
        public string Name { get; set; }
        public Guid? Parent { get; set; } = null;

        public CreateAreaRequest(string name, Guid? parent)
        {
            Name = name;
            Parent = parent;
        }

    }

    public class AreaResponse
    {
        public Guid Id { get; set; }
        public string name { get; set; }
        public Guid? parent { get; set; }

        public AreaResponse(Guid id, string name, Guid? parent)
        {
            Id = id;
            this.name = name;
            this.parent = parent;
        }
    }
}
