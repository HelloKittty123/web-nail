using API.Extensions;
using DLL;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using Services;
using Services.Options;
using System.Net;
using System.Text;

var builder = WebApplication.CreateBuilder(args);



builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(8080); // HTTP
    // options.ListenAnyIP(5009, listenOptions => listenOptions.UseHttps()); // HTTPS
});


#region Cài đặt EF Core

builder.Services.AddDbContext<AppDbContext>(options =>
             options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),
                                 o => o.MigrationsAssembly("DLL")), ServiceLifetime.Transient);

#endregion

/// Đăng ký DI hệ thống
builder.Registers();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

#region Swagger

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "GSM Indonesia api.",
        Version = "v1",
    });

    c.CustomSchemaIds(i => i.FullName);

    c.AddSecurityDefinition("Bearer",
        new OpenApiSecurityScheme
        {
            Description = "JWT Authorization header using the Bearer scheme.",
            Type = SecuritySchemeType.Http,
            Scheme = "bearer"
        });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement{
                    {
                        new OpenApiSecurityScheme{
                            Reference = new OpenApiReference{
                                Id = "Bearer",
                                Type = ReferenceType.SecurityScheme
                            }
                        },new List<string>()
                    }
                    });
    //var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    //var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    //c.IncludeXmlComments(xmlPath);
});

#endregion

#region Quản lý CORS

builder.Services.AddCors(options => options.AddPolicy("CorsPolicy",
buiders =>
{
    buiders
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials()
        .SetIsOriginAllowedToAllowWildcardSubdomains()
        .WithOrigins("http://localhost:4200", "https://localhost:4200", "http://localhost:4201", "https://localhost:4201", "http://localhost:8080");
}));

#endregion

builder.Services.AddHttpContextAccessor();

/// Sử dụng cache trong ứng dụng
builder.Services.AddDistributedMemoryCache();

#region Cài đặt JWT Token

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
  .AddJwtBearer(options =>
  {
      options.TokenValidationParameters = new TokenValidationParameters
      {
          ValidateIssuerSigningKey = true,
          IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII
              .GetBytes(builder.Configuration.GetSection("AppSetting:Token").Value)),
          ValidateIssuer = false,
          ValidateAudience = false,
          ClockSkew = TimeSpan.Zero,
      };
  });
#endregion

#region Cài đặt FrontEnd Folder

builder.Services.AddSpaStaticFiles(configuration =>
{
    configuration.RootPath = "ClientApp";
});

#endregion

#region Đọc dữ liệu appsettings.json

builder.Services.Configure<AppSetting>
    (builder.Configuration.GetSection(nameof(AppSetting)));
builder.Services.Configure<ConnectionStrings>
    (builder.Configuration.GetSection(nameof(ConnectionStrings)));

#endregion

var logger = new LoggerConfiguration()
            .ReadFrom.Configuration(builder.Configuration)
            .Enrich.FromLogContext()
            .CreateLogger();
builder.Logging.ClearProviders();
builder.Logging.AddSerilog(logger);

builder.Services.AddSession(options =>
{
    options.Cookie.Name = "YourSessionCookieName";
    options.IdleTimeout = TimeSpan.FromMinutes(30);
});

var app = builder.Build();
var env = app.Environment;
{
    if (env.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
    }
    else
    {
        app.UseExceptionHandler(builder =>
        {
            builder.Run(async context =>
            {
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                var error = context.Features.Get<IExceptionHandlerFeature>();
                if (error != null)
                {
                    await context.Response.WriteAsync(error.Error.Message);
                }
            });
        });

        app.ConfigureExceptionHandler();
        app.UseHsts();

    }
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Booking");
    });

    app.UseForwardedHeaders(new ForwardedHeadersOptions
    {
        ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
    });

    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(
           Path.Combine(Directory.GetCurrentDirectory(), "wwwroot")),
        RequestPath = "/Files"
    });

    app.UseCors("CorsPolicy");
    app.UseHttpsRedirection();

    app.UseAuthentication();
    app.UseRouting();
    app.UseSession(); // Add this line after UseRouting
    app.UseAuthorization();

    app.UseDefaultFiles();
    app.UseStaticFiles();
    app.UseCookiePolicy();


    app.UseEndpoints(endpoints =>
    {
        endpoints.MapControllers();
    });

}

app.Run();
