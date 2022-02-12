using BusinessLayer.Servces;
using DocumentFormat.OpenXml.Packaging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer
{
    public class DocExtractor : IDocExtractor
    {
        public DocExtractor()
        {
        }

        private string GetDocContent(string path)
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


        private string getProfessionalSummary(string content)
        {
            
            if ((!content.Contains("TECHNOLOGY SUMMARY")
                && !content.Contains("TECHNOLOGY SUMMARY"))
                || !content.Contains("PROFESSIONAL SUMMARY")
                ) throw new Exception("String is not valid for splitting");

            string buffer = content.Contains("TECHNOLOGY SUMMARY") ?
                    content.Split("TECHNOLOGY SUMMARY")[0] :
                    content.Split("TECHNICAL SUMMARY")[0];

            return buffer.Split("PROFESSIONAL SUMMARY")[1];
        }

        private string getKeySkills(string content)
        {
            try
            {
                var buffer = content.Split("PROFESSIONAL EXPERIENCE")[0];
                return buffer.Split("KEY TECHNICAL SKILLS")[1];
            } catch (Exception e)
            {
                return "";
            }
            
        }

        public object ExtractSections(string path)
        {
            string documentContent = GetDocContent(path);
            return new {
                ProfessionalSummary = getProfessionalSummary(documentContent),
                KeyTechSkills = getKeySkills(documentContent)
            };
        }
    }
}
