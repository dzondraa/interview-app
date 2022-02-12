using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Extensions
{
    public static class ParseExtensions
    {
        public static List<string> List(this string context, string delimiter)
        {
            return context.Split(delimiter).ToList();
        }
    }
}
