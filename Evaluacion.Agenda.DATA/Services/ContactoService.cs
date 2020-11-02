using Evaluacion.Agenda.COMMON;
using Evaluacion.Agenda.COMMON.DTO;
using Evaluacion.Agenda.DATA.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Evaluacion.Agenda.DATA.Services
{
    public static class ContactoService
    {
        public static OperationResult Create(ContactoModel contacto)
        {
            try
            {
                #region Validaciones
                if (contacto == null) return new OperationResult() { Message = "El objeto Contacto viene vacío" };
                if (string.IsNullOrEmpty(contacto.Nombre)) return new OperationResult() { Message = "El nombre es requerido" };
                if (string.IsNullOrEmpty(contacto.ApellidoPaterno)) return new OperationResult() { Message = "El apellido paterno es requerido" };
                if (string.IsNullOrEmpty(contacto.Telefono)) return new OperationResult() { Message = "El teléfono es requerido" };
                if (contacto.Nombre.Length > 50) return new OperationResult() { Message = "El nombre debe tener 50 caracteres como máximo" };
                if (contacto.ApellidoPaterno.Length > 50) return new OperationResult() { Message = "El apellido debe tener 50 caracteres como máximo" };
                if (!string.IsNullOrEmpty(contacto.ApellidoMaterno))
                {
                    if (contacto.ApellidoMaterno.Length > 50) return new OperationResult() { Message = "El apellido debe tener 50 caracteres como máximo" };
                }
                if (contacto.Telefono.Length > 16) return new OperationResult() { Message = "El teléfono debe tener 16 caracteres como máximo" };
                if (!string.IsNullOrEmpty(contacto.Direccion))
                {
                    if (contacto.Direccion.Length > 100) return new OperationResult() { Message = "La dirección debe tener 100 caracteres como máximo" };
                }

                var contactosTel = GetBy_Tel(contacto.Telefono);
                if (contactosTel.Any()) return new OperationResult() { Message = "El número de teléfono ya ha sido registrado anteriormente." };

                var contactosEmail = GetBy_Email(contacto.Email);
                if (contactosEmail.Any()) return new OperationResult() { Message = "El correo electrónico ya ha sido registrado anteriormente." };
                #endregion

                using (AgendaContext dbContext = new AgendaContext())
                {
                    dbContext.Contacto.Add(new Contacto()
                    {

                        Activo = true,
                        ApellidoMaterno = contacto.ApellidoMaterno,
                        ApellidoPaterno = contacto.ApellidoPaterno,
                        Direccion = contacto.Direccion,
                        Email = contacto.Email,
                        FechaCreacion = DateTime.Now,
                        Id = Guid.NewGuid(),
                        Nombre = contacto.Nombre,
                        Telefono = contacto.Telefono

                    });

                    dbContext.SaveChanges();

                    return new OperationResult() { Success = true };
                }
            }
            catch (Exception ex)
            {
                return new OperationResult() { Message = ex.Message }; // Normalmente se manda un error genérico, pero se deja así por fines de que es una evaluación
            }
        }
        public static ResponseContactoModel Get(int numRegistros, int numPagina, string filter)
        {
            var rContactos_ = new ResponseContactoModel();

            try
            {
                using (AgendaContext dbContext = new AgendaContext())
                {
                    if (string.IsNullOrEmpty(filter)) filter = "";

                    var rContactos = dbContext.Contacto.Where(x => (bool)x.Activo &&
                    (((x.Nombre ?? "") + " " + (x.ApellidoPaterno ?? "") + " " + (x.ApellidoMaterno ?? "")).Contains(filter) ||
                    x.Email.Contains(filter) ||
                    x.Telefono.Contains(filter) ||
                    x.Direccion.Contains(filter)))
                        .OrderByDescending(x => x.FechaCreacion).ToList();

                    rContactos_.TotalGlobal = rContactos.Count();

                    rContactos = rContactos.Skip((numPagina - 1) * numRegistros)
                   .Take(numRegistros).ToList();

                    rContactos.ForEach(x => rContactos_.ListContactos.Add(new ContactoModel()
                    {
                        ApellidoMaterno = x.ApellidoMaterno,
                        ApellidoPaterno = x.ApellidoPaterno,
                        Direccion = x.Direccion,
                        Email = x.Email,
                        Nombre = x.Nombre,
                        Telefono = x.Telefono,
                        Id = x.Id
                    }));

                    return rContactos_;
                }
            }
            catch
            {
                return rContactos_; // Normalmente se manda un error genérico, pero se deja así por fines de que es una evaluación
            }
        }
        public static OperationResult Delete(Guid id)
        {
            try
            {
                using (AgendaContext dbContext = new AgendaContext())
                {
                    var rContactos = dbContext.Contacto.Where(x => (bool)x.Activo && x.Id == id).ToList();
                    if (!rContactos.Any()) return new OperationResult() { Message = "El contacto con el id ingresado no existe. Verifique." };

                    rContactos.First().Activo = false;

                    dbContext.SaveChanges();

                    return new OperationResult() { Success = true };
                }
            }
            catch (Exception ex) // Normalmente se manda un error genérico, pero se deja así por fines de que es una evaluación
            {
                return new OperationResult() { Message = ex.Message };
            }
        }
        private static List<ContactoModel> GetBy_Tel(string telefono)
        {
            var lContactos = new List<ContactoModel>();
            try
            {
                if (string.IsNullOrEmpty(telefono)) return lContactos;

                using (AgendaContext dbContext = new AgendaContext())
                {
                    var rContactos = dbContext.Contacto.Where(x => (bool)x.Activo && (x.Telefono.Trim() == telefono.Trim())).ToList();

                    rContactos.ForEach(x => lContactos.Add(new ContactoModel()
                    {
                        ApellidoMaterno = x.ApellidoMaterno,
                        ApellidoPaterno = x.ApellidoPaterno,
                        Direccion = x.Direccion,
                        Email = x.Email,
                        Nombre = x.Nombre,
                        Telefono = x.Telefono
                    }));

                    return lContactos;
                }
            }
            catch
            {
                return lContactos;
            }
        }
        private static List<ContactoModel> GetBy_Email(string email)
        {
            var lContactos = new List<ContactoModel>();
            try
            {
                if (string.IsNullOrEmpty(email)) return lContactos;

                using (AgendaContext dbContext = new AgendaContext())
                {
                    var rContactos = dbContext.Contacto.Where(x => (bool)x.Activo && x.Email.Trim().ToUpper() == email.Trim().ToUpper()).ToList();

                    rContactos.ForEach(x => lContactos.Add(new ContactoModel()
                    {
                        ApellidoMaterno = x.ApellidoMaterno,
                        ApellidoPaterno = x.ApellidoPaterno,
                        Direccion = x.Direccion,
                        Email = x.Email,
                        Nombre = x.Nombre,
                        Telefono = x.Telefono
                    }));

                    return lContactos;
                }
            }
            catch
            {
                return lContactos;
            }
        }
        public static OperationResult Update(ContactoModel contacto)
        {
            try
            {
                #region Validaciones
                if (contacto == null) return new OperationResult() { Message = "El objeto Contacto viene vacío" };
                if (string.IsNullOrEmpty(contacto.Nombre)) return new OperationResult() { Message = "El nombre es requerido" };
                if (string.IsNullOrEmpty(contacto.ApellidoPaterno)) return new OperationResult() { Message = "El apellido paterno es requerido" };
                if (string.IsNullOrEmpty(contacto.Telefono)) return new OperationResult() { Message = "El teléfono es requerido" };
                if (contacto.Nombre.Length > 50) return new OperationResult() { Message = "El nombre debe tener 50 caracteres como máximo" };
                if (contacto.ApellidoPaterno.Length > 50) return new OperationResult() { Message = "El apellido debe tener 50 caracteres como máximo" };
                if (!string.IsNullOrEmpty(contacto.ApellidoMaterno))
                {
                    if (contacto.ApellidoMaterno.Length > 50) return new OperationResult() { Message = "El apellido debe tener 50 caracteres como máximo" };
                }
                if (contacto.Telefono.Length > 16) return new OperationResult() { Message = "El teléfono debe tener 16 caracteres como máximo" };
                if (!string.IsNullOrEmpty(contacto.Direccion))
                {
                    if (contacto.Direccion.Length > 100) return new OperationResult() { Message = "La dirección debe tener 100 caracteres como máximo" };
                }

                var contactosTel = GetBy_Tel(contacto.Telefono);
                var contactosEmail = GetBy_Email(contacto.Email);

                if (contactosTel.Any())
                {
                    if (!contactosTel.Where(x => x.Id == contacto.Id).ToList().Any())
                    {
                        return new OperationResult() { Message = "El número de teléfono ya ha sido registrado anteriormente." };
                    }
                }

                if (contactosEmail.Any())
                {
                    if (!contactosEmail.Where(x => x.Id == contacto.Id).ToList().Any())
                    {
                        return new OperationResult() { Message = "El correo electrónico ya ha sido registrado anteriormente." };
                    }
                }

                #endregion

                using (AgendaContext dbContext = new AgendaContext())
                {
                    dbContext.Contacto.Add(new Contacto()
                    {

                        Activo = true,
                        ApellidoMaterno = contacto.ApellidoMaterno,
                        ApellidoPaterno = contacto.ApellidoPaterno,
                        Direccion = contacto.Direccion,
                        Email = contacto.Email,
                        FechaCreacion = DateTime.Now,
                        Id = Guid.NewGuid(),
                        Nombre = contacto.Nombre,
                        Telefono = contacto.Telefono

                    });

                    dbContext.SaveChanges();

                    return new OperationResult() { Success = true };
                }
            }
            catch (Exception ex)
            {
                return new OperationResult() { Message = ex.Message }; // Normalmente se manda un error genérico, pero se deja así por fines de que es una evaluación
            }
        }
    }
}
