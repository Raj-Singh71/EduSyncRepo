
//models is a folder that contains classes that represent the data in the application
//User is a class that represents a user in the application

namespace EduSyncBackend.Models
{
    public class User
    {
        public int Id { get; set; } //Id is treated as a primary key by default
        public string Name { get; set; } 
        public string Email { get; set; } // get and set are used to define properties
        public string Password { get; set; }
        public string Role { get; set; }
    }
}
