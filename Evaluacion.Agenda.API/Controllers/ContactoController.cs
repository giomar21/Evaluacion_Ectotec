using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Evaluacion.Agenda.COMMON;
using Evaluacion.Agenda.COMMON.DTO;
using Evaluacion.Agenda.DATA.Services;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Evaluacion.Agenda.API.Controllers
{
    [Route("api/Contacto")]
    [ApiController]
    public class ContactoController : ControllerBase
    {
        [HttpPost]
        [ActionName("")]
        public OperationResult Post([FromBody] ContactoModel contacto)
        {
            return ContactoService.Create(contacto);
        }

        [HttpGet]
        [ActionName("")]
        public ResponseContactoModel Get(int numRegistros, int numPagina, string filter)
        {
            return ContactoService.Get(numRegistros, numPagina, filter);
        }

        [HttpDelete]
        [ActionName("")]
        public OperationResult Delete(Guid id)
        {
            return ContactoService.Delete(id);
        }

        [HttpPut]
        [ActionName("")]
        public OperationResult Put([FromBody] ContactoModel contacto)
        {
            return ContactoService.Update(contacto);
        }
    }
}
