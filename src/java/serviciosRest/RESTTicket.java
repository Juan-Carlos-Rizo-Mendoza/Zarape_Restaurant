package serviciosRest;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.sql.SQLException;
import org.bucket.zarape.controller.ControllerTicket;
/**
 *
 * @author Adonaì
 */
@Path("tickets")
public class RESTTicket {
    
    @Path("agregar")
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response agregar(@FormParam("idCliente") @DefaultValue("0") int idCliente,
            @FormParam("idSucursal") @DefaultValue("0") int idSucursal, 
            @FormParam("ticket") @DefaultValue("") String ticket,
            @FormParam("pagado") @DefaultValue("") String pagado,
            @FormParam("jsonDetalles") @DefaultValue("") String jsonDetalles) throws SQLException {
        String out = null;
        ControllerTicket ct = new ControllerTicket();
        Gson gson = new Gson();
        try
        {
            ct.registrarTicketComanda(idCliente, idSucursal, ticket, pagado, jsonDetalles);
            out = """
              {"resultado":"El ticket del cliente %d ha sido generado correctamente"}
              """;
            out = String.format(out, idCliente);
        } catch (JsonSyntaxException jpe)
        {
            out = """
              {"error" : "Formato de datos no valido."}
              """;
            jpe.printStackTrace();
        } catch (Exception ex)
        {
            out = """
              {"error" : "Error interno del servidor. Intente más tarde"}
              """;
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }
}
