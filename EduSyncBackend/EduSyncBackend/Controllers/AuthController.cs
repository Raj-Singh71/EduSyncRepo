using Microsoft.AspNetCore.Mvc; // its lets us use controllers methods and lets us create APIs
using EduSyncBackend.Models; //it gets classes and interfaces from the models folder 
using System.Linq;           // it helps us let us work with list or collections of data LINQ stands for Language Integrated Query
using EduSyncBackend.Data;
using EduSyncBackend.DTOs;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;


namespace EduSyncBackend.Controllers   
{
    
    
    [ApiController]            //it tells the webapi that its a webapi controller 
    [Route("api/[controller]")] //its tells the route will be api/auth it drops the controller part

    public class AuthController: ControllerBase  //controllerBase is built in class it lets us get data from rquest and send data to the response, and handles http requests
    {

        private readonly ApplicationDbContext _context; // it creates a private variable of ApplicationDbContext with which we connect controller to the database

        private readonly IConfiguration _configuration;
        public AuthController(ApplicationDbContext context, IConfiguration configuration )// this is a constructor , which creates a object of ApplicationDbContext by dependecy injection assigns it to private varibales
        {
            _context = context;
            _configuration = configuration;
        }

   

        [HttpPost("register")] //this is an attribute that tells that this method is for post request 
        public IActionResult Register([FromBody] User user) // The IActionResult is an interface that proides return types like , BadRequest,Ok()
        {                                                   //[FromBody] is an attribute that fetches data from request body and User model object is created that holds all the data
            var existingUser =
                _context.Users.FirstOrDefault(u => u.Email == user.Email); //FirstOrDefault is a LINQ method taht gets the first element of the collection if found
            if (existingUser != null)                                  //u is just a varibale or placeholder that loos in the collection and checks if the email is akready present
                return BadRequest("User already exists");             // status code 400 is returned to frontend 

            _context.Users.Add(user);
            _context.SaveChanges();
            return Ok("Registration Successfully"); //status code 200 is sent to front end
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto login)
        {
            var existingUser = _context.Users.FirstOrDefault(u =>
                u.Email == login.Email &&
                u.Password == login.Password &&
                u.Role == login.Role);

            if (existingUser == null)
                return Unauthorized("Invalid credentials");

            // Step 1: Define claims
            var claims = new[]
            {
        new Claim("email", existingUser.Email),
        new Claim("role", existingUser.Role),
        new Claim("userId", existingUser.Id.ToString())
    };

            // Step 2: Generate signing key
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Step 3: Create token
            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            // Step 4: Return token
            return Ok(new
            {
                token = tokenString,
                role = existingUser.Role,
                email = existingUser.Email
            });
        }


    }
}
