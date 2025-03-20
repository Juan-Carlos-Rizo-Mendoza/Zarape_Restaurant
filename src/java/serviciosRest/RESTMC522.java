package serviciosRest;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.bucket.zarape.arduino.Proceso;

import java.util.logging.Logger;

/**
 * Servicio REST para interactuar con el módulo MC522.
 */
@Path("mc522")
public class RESTMC522 {
    @Path("getAll")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public Response getAll(){
        Proceso pc = new Proceso();
        String datos = pc.run();
        return Response.status(Response.Status.OK).entity(datos).build();
    }
}