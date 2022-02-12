using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace API.Dto.Search
{
    public class DocumentSearch
    {
        public string Path { get; set; }
        public int TargetMatch { get; set; }
        public string Keyword { get; set; }
    }
}
