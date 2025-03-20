package serviciosRest;
import com.google.gson.Gson;
import org.bucket.zarape.controller.controllerEstado;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import org.bucket.zarape.modelo.Estado;

@Path("estado")
public class restEstado {
    @Path("getAll")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public Response getAll(){
        String out = null;
        List<Estado> estado = null;
        controllerEstado ce = new controllerEstado();
        try {
            estado = ce.getAll();
            out = new Gson().toJson(estado);
        } catch (Exception e) {
        out="""
                {"error": "Ocurrio un error. Intente mas tarde"}
                """;
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }
    
}
