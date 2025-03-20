package serviciosRest;

/**
 *
 * @author sault
 */
import com.google.gson.Gson;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.sql.SQLException;
import java.util.List;
import org.bucket.zarape.modelo.Usuario;
import org.bucket.zarape.controller.ControllerUsuario;

@Path("usuario")
public class RESTUsuario {

    @Path("getAllUsuario")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public Response getAllUsuario() {
        String out = null;
        List<Usuario> usuario = null;
        ControllerUsuario ctrlu = new ControllerUsuario();
        try {
            usuario = ctrlu.getAllUsuario();
            out = new Gson().toJson(usuario);
        } catch (Exception e) {
            out = """
                  {"error" : "Error"}
                  """;
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }

@Path("login")
@Produces(MediaType.APPLICATION_JSON)
@POST
public Response login(@FormParam("datosUsuario") @DefaultValue("") String usuario) throws SQLException {
    String out = null;
    Usuario u = null;
    ControllerUsuario ctrlu = new ControllerUsuario();
    Gson gson = new Gson();
    
    // Convertir el JSON recibido en un objeto Usuario
    Usuario user = gson.fromJson(usuario, Usuario.class);
    
    // Validar las credenciales del usuario
    boolean valido = ctrlu.validar(user.getNombre(), user.getContrasenia());
    
    // Si las credenciales son válidas
    if (valido) {
        return Response.status(Response.Status.OK)
                       .entity("{\"message\":\"Usuario autenticado\"}")  // Respuesta JSON
                       .build();
    } else {
        // Si las credenciales no son válidas
        return Response.status(Response.Status.UNAUTHORIZED)
                       .entity("{\"message\":\"Usuario inválido\"}")  // Respuesta JSON
                       .build();
    }    
}

@Path("cheeckingUser")
@Produces(MediaType.APPLICATION_JSON)
@GET
public Response cheeckingUser (@QueryParam("nombre") @DefaultValue("") String nombre,
        @QueryParam("contrasenia") @DefaultValue("") String contrasenia){
    String out = null;
    boolean usuario;
    ControllerUsuario ctrlu = new ControllerUsuario();
    try {
        //usuario = ctrlu.validar(nombre, contrasenia);
        usuario = ctrlu.validar(nombre, contrasenia);
        out = new Gson().toJson(usuario);
    } catch (Exception e) {
        out = """
              {"error": "Error"}
              """;
        System.out.println(e.getMessage());
    }
    return Response.status(Response.Status.OK).entity(out).build();
}


}
