package serviciosRest;

import org.bucket.zarape.modelo.Empleado;
import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import jakarta.ws.rs.Consumes;
import org.bucket.zarape.controller.ControllerEmpleado;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.sql.SQLException;
import java.util.List;

@Path("empleado")
public class RESTEmpleado {

    @Path("agregarEmpleado")
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response agregarEmpleado(@FormParam("datosEmpleado") @DefaultValue("") String empleado) throws SQLException {
        String out = null;
        Empleado e = null;
        ControllerEmpleado ctrl = null;
        Gson gson = new Gson();
        try {
            e = gson.fromJson(empleado, Empleado.class);
            ctrl = new ControllerEmpleado();

            if (e.getIdEmpleado() < 1) {
                e.setIdEmpleado(ctrl.add(e).getIdEmpleado());
            } else {
                e = ctrl.update(e);
            }
            out = gson.toJson(e);
        } catch (JsonSyntaxException jpe) {
            out = """
                  {"error" : "Formato de datos no valido."}
                  """;
            jpe.printStackTrace();
        } catch (Exception ex) {
            out = """
                  {"error" : "Error interno del servidor. Intente más tarde"}
                  """;
            ex.printStackTrace();
            System.out.println("Error " + ex);
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }


    @Path("actualizarEmpleado")
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response actualizarEmpleado(@FormParam("datosEmpleado") @DefaultValue("") String empleado) throws SQLException {
        String out = null;
        Empleado e = null;
        ControllerEmpleado ctrl = null;
        Gson gson = new Gson();
        try {
            e = gson.fromJson(empleado, Empleado.class);
            ctrl = new ControllerEmpleado();
                e = ctrl.update(e);            
            out = gson.toJson(e);
        } catch (JsonSyntaxException jpe) {
            out = """
                  {"error" : "Formato de datos no valido."}
                  """;
            jpe.printStackTrace();
        } catch (Exception ex) {
            out = """
                  {"error" : "Error interno del servidor. Intente más tarde"}
                  """;
            ex.printStackTrace();
            System.out.println("Error " + ex);
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }


    @Path("getAllEmpleado")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public Response getAllEmpleado() {
        String out = null;
        List<Empleado> empleado = null;
        ControllerEmpleado ctrle = new ControllerEmpleado();
        try {
            empleado = ctrle.getAllEmpleado();
            out = new Gson().toJson(empleado);
        } catch (Exception e) {
            out = """
                  {"error" : "Error"}
                  """;
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }

    //---------------------------------------------------------------------------------------------------------------
    
    @Path("eliminar")
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response eliminar(@FormParam("idEmpleado") @DefaultValue("0") int idEmpleado) {
        String out = null;
        ControllerEmpleado ctrl = null;

        try {
            ctrl = new ControllerEmpleado();
            ctrl.delete(idEmpleado);
            out = """
                  { "resultado" : "Empleado %d eliminado."}
                  """;
            out = String.format(out, idEmpleado);
        } catch (JsonSyntaxException jpe) {
            out = """
                  {"error" : "Formato de datos no valido."}
                  """;
            jpe.printStackTrace();
        } catch (Exception ex) {
            out = """
                  {"error" : "Error interno del servidor. Intente más tarde"}
                  """;
            ex.printStackTrace();
            System.out.println("Error " + ex);
        }

        return Response.status(Response.Status.OK).entity(out).build();
    }
}
