using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Extensions
{
    public static class Responses
    {
        public static object EnsurePagedResponse(this IEnumerable<object> data)
        {
            return new { data = data, count = data.Count() };
        }
    }
}
