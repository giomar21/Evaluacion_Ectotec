using System;
using System.Collections.Generic;

namespace Evaluacion.Agenda.DATA.Models
{
    public partial class Contacto
    {
        public Guid Id { get; set; }
        public string Nombre { get; set; }
        public string ApellidoPaterno { get; set; }
        public string ApellidoMaterno { get; set; }
        public string Direccion { get; set; }
        public string Telefono { get; set; }
        public string Email { get; set; }
        public DateTime FechaCreacion { get; set; }
        public bool? Activo { get; set; }
    }
}
