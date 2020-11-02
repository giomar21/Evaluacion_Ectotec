using System;
using System.Collections.Generic;
using System.Text;

namespace Evaluacion.Agenda.COMMON.DTO
{
    public class ContactoModel
    {
        public string Nombre { get; set; }
        public string ApellidoPaterno { get; set; }
        public string ApellidoMaterno { get; set; }
        public string Direccion { get; set; }
        public string Telefono { get; set; }
        public string Email { get; set; }
        public Guid Id { get; set; }
    }
}
