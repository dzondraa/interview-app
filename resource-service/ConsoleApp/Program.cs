using System;
using System.Diagnostics;
using BusinessLayer;

namespace ConsoleApp
{
    class Program
    {
        static void Main(string[] args)
        {
            var docService = new DocService();
            Console.WriteLine("Enter absolute path location please");
            var path = Console.ReadLine();
            Console.WriteLine("Choose delimiter number (number)");
            var delimiter = Console.ReadLine();
            int delimiterInt = Int32.Parse(delimiter);
            //var path = @"C:\Users\v-dnikolic\Desktop\Ildar";
            Console.WriteLine("Please enter a keyword (case-sensitive)");
            var keyword = Console.ReadLine();
            Console.WriteLine("Hold on, we are searching for your relevant documents :)");
            var time = Stopwatch.StartNew();
            var output = docService.RunThroughFolders(path, keyword, delimiterInt);
            Console.WriteLine(output);
            Console.WriteLine("Took " + time.Elapsed);
            Console.Read();
            
        }
    }
}
