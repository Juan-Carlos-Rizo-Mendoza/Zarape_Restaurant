package serviciosRest;

import com.google.gson.Gson;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.Map;
import org.bucket.zarape.controller.ControllerUsuario;

/**
 *
 * @author sault
 */
@Path("login")
public class RESTLogIn {
@Path("checkingUser")
@Produces(MediaType.APPLICATION_JSON)
@GET
public Response checkingUser(@QueryParam("nombre") @DefaultValue("") String nombre) {
    String out = null;
    ControllerUsuario ctrlu = new ControllerUsuario();

    try {
        String usuario = ctrlu.checkUsers(nombre);
        out = new Gson().toJson(usuario);
    } catch (Exception e) {
        out = """
              {"error": "Error al procesar la solicitud", "message": "%s"}
              """.formatted(e.getMessage());
        System.out.println(e.getMessage());
    }

    return Response.status(Response.Status.OK).entity(out).build();
}

@Path("borrarToken")
@Produces(MediaType.APPLICATION_JSON)
@GET
public Response borrarToken(@QueryParam("nombre") @DefaultValue("") String nombre) {
    String out = null;
    ControllerUsuario ctrlu = new ControllerUsuario();

    try {
        String mensaje = ctrlu.borrarToken(nombre);
        out = new Gson().toJson(Map.of("message", mensaje));
    } catch (Exception e) {
        out = new Gson().toJson(Map.of(
            "error", "Error al procesar la solicitud",
            "message", e.getMessage()
        ));
        System.out.println(e.getMessage());
    }

    return Response.status(Response.Status.OK).entity(out).build();
}

}
