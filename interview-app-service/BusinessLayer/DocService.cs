using BusinessLayer.Models;
using BusinessLayer.Servces;
using DocumentFormat.OpenXml.Packaging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;

namespace BusinessLayer
{
    public class DocService : IDocService
    {
        /// <summary>
        /// Checking if file containing keyword mor thatn minRepetitions times
        /// </summary>
        public int CheckFileRelevancy(string path, string keyword, int minRepetitions = 10)
        {
            WordprocessingDocument wordprocessingDocument = null;
            try
            {
                wordprocessingDocument = WordprocessingDocument.Open(path, true);
                var body = wordprocessingDocument.MainDocumentPart.Document.Body.InnerText;
                int matches = Regex.Matches(body, keyword).Count;
                return matches;
                
                
            } 
            catch (Exception e)
            {
                Console.WriteLine(e);
                return 0;
            }

            finally
            {
                if (wordprocessingDocument != null)
                {
                    wordprocessingDocument.Close();
                    wordprocessingDocument.Dispose();
                }
            }
            
           
        }

        /// <summary>
        /// Generate a RolloutSpecCache object from an existing <paramref name="cache"/>.
        /// </summary>
        /// <param name="delimiter">
        /// Cached data to generate the RolloutSpecCache object from.
        /// </param>
        public IEnumerable<DocumentInfo> RunThroughFolders(string folderPath, string keyword, int delimiter, string extension = "*.docx")
        {
            var s = Stopwatch.StartNew();
            var matchedDocuments = CollectDataFromFolders(folderPath, keyword, delimiter);
            GC.Collect();
            s.Stop();
            Console.WriteLine("Time spent: " + s.ElapsedMilliseconds); 
            return matchedDocuments;


        }


        private IEnumerable<DocumentInfo> CollectDataFromFolders(string folderPath, string keyword, int delimiter, string extension = "*.docx")
        {
            DirectoryInfo dirInfo = new DirectoryInfo(folderPath); 
            var directories = dirInfo.GetDirectories();
            FileInfo[] files = dirInfo.GetFiles(extension);  //Getting Text files
            var matchDocuments = new List<DocumentInfo>();

            foreach( var file in files)
            {
                int matches = CheckFileRelevancy(file.FullName, keyword, delimiter);
                if (matches > delimiter) matchDocuments.Add(new DocumentInfo(file.FullName, matches));
            }

            Parallel.ForEach(directories, dir =>
            {
                matchDocuments.AddRange(CollectDataFromFolders(dir.FullName, keyword, delimiter));
            });
            
            return matchDocuments;

        }

        public string GetAboutSection(string path)
        {
            WordprocessingDocument wordprocessingDocument;
            try
            {
                wordprocessingDocument = WordprocessingDocument.Open(path, true);
                var body = wordprocessingDocument.MainDocumentPart.Document.Body.InnerText;

                var buffer = body.Contains("TECHNOLOGY SUMMARY") ?
                    body.Split("TECHNOLOGY SUMMARY")[0] :
                    body.Split("TECHNICAL SUMMARY")[0];

                var profSummary = buffer.Split("PROFESSIONAL SUMMARY")[1];
                wordprocessingDocument.Close();
                return profSummary;
            }
            catch (Exception e)
            {
                return "";
            }


        }

        public string GetDocContent(string path)
        {
            WordprocessingDocument wordprocessingDocument;
            try
            {
                wordprocessingDocument = WordprocessingDocument.Open(path, true);
                var body = wordprocessingDocument.MainDocumentPart.Document.Body.InnerText;
                wordprocessingDocument.Close();
                return body;
            }
            catch (Exception e)
            {
                return "";
            }


        }
    }

}
