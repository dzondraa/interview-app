using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.Models
{
    public class DocumentInfo
    {
        public string Path { get; set; }
        public int Relevancy { get; set; }
        public string Name { get; set; }

        public DocumentInfo(string path, int relevancy)
        {
            Path = path;
            Relevancy = relevancy;
            Name = path.Split("\\")[path.Split("\\").Length - 1];
        }
    }
}
