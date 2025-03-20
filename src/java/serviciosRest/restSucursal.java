package serviciosRest;

import com.google.gson.Gson;
import org.bucket.zarape.controller.controllerSucursal;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.bucket.zarape.modelo.Sucursal;

@Path("sucursal")
public class restSucursal {

    // Obtener todas las sucursales
    @Path("getAll")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public Response getAll() {
        String out = null;
        controllerSucursal cs = new controllerSucursal();
        try {
            out = new Gson().toJson(cs.getAll()); // Convertir la lista de sucursales a JSON
        } catch (Exception e) {
            out = "{\"error\": \"Ocurrió un error al obtener las sucursales.\"}";
            e.printStackTrace();
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }

    // Agregar una sucursal
    @Path("agregar")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response agregar(String json) {
        String out;
        controllerSucursal cs = new controllerSucursal();
        Gson gson = new Gson();
        try {
            // Convertir el JSON recibido a un objeto Sucursal
            Sucursal sucursal = gson.fromJson(json, Sucursal.class);
            cs.add(sucursal); // Llamar al método para agregar sucursal
            out = "{\"resultado\": \"Sucursal agregada exitosamente.\"}";
        } catch (Exception e) {
            out = "{\"error\": \"Ocurrió un error al agregar la sucursal.\"}";
            e.printStackTrace();
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }

    // Actualizar una sucursal
    @Path("actualizar")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response actualizar(String json) {
        String out;
        controllerSucursal cs = new controllerSucursal();
        Gson gson = new Gson();
        try {
            // Convertir el JSON recibido a un objeto Sucursal
            Sucursal sucursal = gson.fromJson(json, Sucursal.class);
            cs.update(sucursal); // Llamar al método para actualizar sucursal
            out = "{\"resultado\": \"Sucursal actualizada exitosamente.\"}";
        } catch (Exception e) {
            out = "{\"error\": \"Ocurrió un error al actualizar la sucursal.\"}";
            e.printStackTrace();
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }

    // Eliminar (desactivar) una sucursal
    @Path("eliminar")
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response eliminar(@FormParam("idSucursal") @DefaultValue("0") int idSucursal) {
        String out;
        controllerSucursal cs = new controllerSucursal();
        try {
            if (idSucursal > 0) {
                cs.delete(idSucursal); // Desactivar la sucursal
                out = "{\"resultado\": \"Sucursal eliminada (desactivada).\"}";
            } else {
                out = "{\"error\": \"ID de sucursal no válido.\"}";
            }
        } catch (Exception e) {
            out = "{\"error\": \"Ocurrió un error al eliminar la sucursal.\"}";
            e.printStackTrace();
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }
}
