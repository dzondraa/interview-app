using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.Servces
{
    public interface IDocExtractor
    {
        public object ExtractSections(string path);
    }
}
