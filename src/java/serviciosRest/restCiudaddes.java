package serviciosRest;

import com.google.gson.Gson;
import org.bucket.zarape.controller.controllerCiudad;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import org.bucket.zarape.modelo.Ciudad;

@Path("ciudad")
public class restCiudaddes {

    @Path("getAll")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public Response getAll() {
        String out = null;
        List<Ciudad> ciudades = null;
        controllerCiudad cc = new controllerCiudad();
        try {
            ciudades = cc.getAll();
            out = new Gson().toJson(ciudades);
        } catch (Exception e) {
            out = """
                {"error": "Ocurrio un error. Intente mas tarde"}
                """;
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }
}