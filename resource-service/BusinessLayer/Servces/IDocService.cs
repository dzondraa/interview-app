using BusinessLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.Servces
{
    public interface IDocService
    {
        public int CheckFileRelevancy(string path, string keyword, int minRepetitions);
        public IEnumerable<DocumentInfo> RunThroughFolders(string folderPath, string keyword, int delimiter, string extension = "*.docx");
        public string GetAboutSection(string path);
        public string GetDocContent(string path);
    }
}
