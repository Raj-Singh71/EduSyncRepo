using EduSyncBackend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System;
using EduSyncBackend.Services;


//azure data factory has three different runtimes, the azure data factory runtime,
//the self-hosted integration runtime, and the azure integration runtime.
//The azure data factory runtime is used for data movement and transformation in the cloud.
//The self-hosted integration runtime is used for data movement and transformation on-premises or in a virtual network.
//The azure integration runtime is used for data movement and transformation in the cloud and on-premises.

namespace EduSyncBackend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args); //builder is an instance of WebApplicaitonBuilder,its used to configure the we app pipeline
            builder.Services.AddDbContext<ApplicationDbContext>(options =>              //builder.Services accesses the list of things your app can use via DI dependency injection 
                                                                                        // we are adding EF's DbContext to the list of services  whih is ApplicaitonDbContext
            options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),sqlOptions =>sqlOptions.EnableRetryOnFailure()
            ) //options.UseSqlServer tells your EF to use sql Server as database provider
            );              //this line is fetching the connection string which we created in appsettings.json
                            //overall we are adding ApplicationDbContext to the list of services and telling it to use SQL server


            // Add services to the container.
            builder.Services.AddSingleton<AzureBlobService>();

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            //Havent Studied About it Yet

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy =>
                {
                    policy.WithOrigins("http://localhost:3000").AllowAnyHeader().AllowAnyMethod();
                });
            });


            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;

                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

            }).AddJwtBearer(options => {

                options.TokenValidationParameters = new TokenValidationParameters
                {

                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,

                    ValidIssuer = builder.Configuration["Jwt:Issuer"],
                    ValidAudience = builder.Configuration["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))


                };

            });








            var app = builder.Build();

          

                app.UseCors("AllowFrontend");

            // Configure the HTTP request pipeline.
            
                app.UseSwagger();
                app.UseSwaggerUI();
            


            app.UseStaticFiles(); // Enables serving files from wwwroot folder


            app.UseHttpsRedirection();
            app.UseCors("AllowFrontend");
            app.UseAuthentication();
            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
