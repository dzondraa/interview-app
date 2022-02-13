using Google.Apis.Auth;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Core.Middleware
{
    public class ExceptionHandler
    {
        private readonly RequestDelegate _next;

        public ExceptionHandler(RequestDelegate next)
        {
            _next = next;        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch(Exception ex)
            {
                context.Response.ContentType = "application/json";
                object response = new
                {
                    message = ex.GetBaseException().Message
                };
                var statusCode = StatusCodes.Status500InternalServerError;
                var type = ex.GetType();
                switch (ex)
                {

                    case InvalidJwtException _:
                        statusCode = StatusCodes.Status401Unauthorized;
                        response = new
                        {
                            stackTrace = ex.StackTrace,
                            data = ex.Data,
                            baseException = ex.GetBaseException().Message
                        };
                        break;
                }


                        context.Response.StatusCode = statusCode;

                if (response != null)
                {
                    await context.Response.WriteAsync(JsonConvert.SerializeObject(response));
                    return;
                }

                await Task.FromResult(context.Response);
            }

        }
    }
}
