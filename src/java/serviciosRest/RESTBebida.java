package serviciosRest;


import org.bucket.zarape.modelo.Bebida;
import com.google.gson.Gson;
import com.google.gson.JsonParseException;
import com.google.gson.JsonSyntaxException;
import org.bucket.zarape.controller.ControllerBebida;
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



/**
 *
 * @author Adonaì
 */
@Path("bebidas")
public class RESTBebida {
    
    @Path("agregar")
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response agregar(@FormParam("datosBebida") @DefaultValue("") String bebida) throws SQLException {
        String out = null;
        Bebida b = null;
        ControllerBebida ctrl = null;
        Gson gson = new Gson();
        try
        {
            b = gson.fromJson(bebida, Bebida.class);
            ctrl = new ControllerBebida();
            if (b.getIdBebida()< 1)
            {
                b.setIdBebida(ctrl.add(b).getIdBebida());
            } else
            {
                b = ctrl.update(b);
            }
            out = gson.toJson(b);
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
    
    @Path("eliminar")
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response eliminar(@FormParam("idBebida") @DefaultValue("0") int idBebida) {
        String out = null;
        ControllerBebida ctrl = null;

        try
        {
            ctrl = new ControllerBebida();

            ctrl.delete(idBebida);

            out = """
              {"resultado":"Bebida %d eliminada"}
              """;
            out = String.format(out, idBebida);
        } catch (JsonParseException jpe)
        {
            out = """
              {"error":"Formato de datos no valido"}
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
    
    @Path("getAll")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public Response getAll() {

        String out = null;
        List<Bebida> bebidas = null;
        ControllerBebida cb = new ControllerBebida();

        try
        {
            bebidas = cb.getAll();
            out = new Gson().toJson(bebidas);
        } catch (SQLException e)
        {
            out = """
                  {"error":"Ocurrio un error, intentelo luego"}
                  """+e;
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }
    
    
}