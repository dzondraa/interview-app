using Google.Apis.Auth;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace API.Core.Middleware
{
    public class AuthMiddlware
    {
        private readonly RequestDelegate _next;


        public AuthMiddlware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            var authHeader = context.Request.Headers["Authorization"][0];
            if (authHeader != null && authHeader.StartsWith("Bearer", StringComparison.OrdinalIgnoreCase))
            {
                var token = authHeader.Split(" ")[1];
                var payload = await GoogleJsonWebSignature.ValidateAsync(token);
                var emailClaim = new Claim("email", payload.Email);
                
                var claims = new[] { emailClaim };
                var identity = new ClaimsIdentity(claims, "Basic");
                context.User = new ClaimsPrincipal(identity);
                
            }
            else
            {
                context.Response.StatusCode = 401;
                context.Response.Headers.Add("WWW-Authenticate", "Basic realm=\"dotnetthoughts.net\"");
            }
            await _next(context);
        }
    }
}
