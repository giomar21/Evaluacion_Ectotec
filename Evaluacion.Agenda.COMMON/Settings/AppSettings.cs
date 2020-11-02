using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace Evaluacion.Agenda.COMMON.Settings
{
    public static class AppSettings
    {
        public static IConfigurationSection GetSection(string section)
        {
            IConfigurationRoot configuration = new ConfigurationBuilder()
                 .SetBasePath(Directory.GetCurrentDirectory())
                 .AddJsonFile("appsettings.json")
                 .Build();

            return configuration.GetSection(section);
        }
    }
}
