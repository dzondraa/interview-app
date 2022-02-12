using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CloudStorage.Dto.Requests
{
    public class NewQuestionRequest
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; }
        public string Description { get; set; }
        public int Complexity { get; set; }
        public IEnumerable<Guid> Areas { get; set; }

    }
}
