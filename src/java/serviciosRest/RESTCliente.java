package serviciosRest;

import org.bucket.zarape.modelo.Cliente;
import com.google.gson.Gson;
import com.google.gson.JsonParseException;
import jakarta.ws.rs.DefaultValue;
import com.google.gson.JsonSyntaxException;
import org.bucket.zarape.controller.ControllerCliente;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Application;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.sql.SQLException;
import java.util.List;

/**
 *
 * @author sault
 */
@Path("cliente")
public class RESTCliente {

    @Path("getAllClientes")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public Response getAllClientes() {
        try {
            ControllerCliente cc = new ControllerCliente();
            List<Cliente> clientes = cc.getAll();
            return Response.status(Response.Status.OK).entity(new Gson().toJson(clientes)).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("{\"error\":\"Error\"}").build();
        }
    }

    @Path("agregar")
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response agregar(@FormParam("datosCliente") @DefaultValue("") String cliente) {
        try {
            Gson gson = new Gson();
            Cliente c = gson.fromJson(cliente, Cliente.class);
            ControllerCliente ctrl = new ControllerCliente();
            c = ctrl.add(c);
            return Response.status(Response.Status.OK).entity(gson.toJson(c)).build();
        } catch (JsonParseException jpe) {
            return Response.status(Response.Status.BAD_REQUEST).entity("{\"error\":\"Formato de datos no válido\"}").build();
        } catch (SQLException ex) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("{\"error\":\"Error al acceder a la base de datos\"}").build();
        } catch (Exception ex) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("{\"error\":\"Error interno del servidor\"}").build();
        } 
    }

    @Path("actualizar")
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response actualizar(@FormParam("datosCliente") @DefaultValue("") String cliente) {
        try {
            Gson gson = new Gson();
            Cliente c = gson.fromJson(cliente, Cliente.class);
            ControllerCliente ctrl = new ControllerCliente();
            c = ctrl.update(c);
            return Response.status(Response.Status.OK).entity(gson.toJson(c)).build();
        } catch (JsonParseException jpe) {
            return Response.status(Response.Status.BAD_REQUEST).entity("{\"error\":\"Formato de datos no válido\"}").build();
        } catch (SQLException ex) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("{\"error\":\"Error al acceder a la base de datos\"}").build();
        } catch (Exception ex) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("{\"error\":\"Error interno del servidor\"}").build();
        }
    }

    @Path("eliminar")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response eliminar(@FormParam("idCliente") int idCliente) {
        String out = null;

        try {
            ControllerCliente ctrl = new ControllerCliente();
            String mensaje = ctrl.delete(idCliente);
            out = String.format("{\"mensaje\":\"%s\"}", mensaje);
            return Response.status(Response.Status.OK).entity(out).build();
        } catch (Exception ex) {
            out = "{\"error\":\"Error interno del servidor\"}";
            ex.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(out).build();
        }
    }
}
