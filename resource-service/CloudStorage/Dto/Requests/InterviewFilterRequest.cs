using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CloudStorage.Dto.Requests
{
    public class InterviewFilter
    {
        public IEnumerable<string> Areas { get; set; }
        public string Status { get; set; }
        public string Candidate { get; set; }
    }
}
