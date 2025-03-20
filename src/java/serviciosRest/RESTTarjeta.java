package serviciosRest;

import com.google.gson.Gson;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.Produces;
import java.util.List;
import org.bucket.zarape.controller.ControllerTarjeta;
import org.bucket.zarape.modelo.Tarjeta;
/**
 *
 * @author sault
 */
@Path("tarjeta")
public class RESTTarjeta {
    @GET
    @Path("getAll")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll(){
        String out = null;
        List<Tarjeta> tarjeta = null;
        ControllerTarjeta ctrlt = new ControllerTarjeta();
        try {
            tarjeta = ctrlt.getAll();
            out = new Gson().toJson(tarjeta);
        } catch (Exception e) {
            out = """
                  {"error": "Error"}
                  """;
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }
}
