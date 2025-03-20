package serviciosRest;

import org.bucket.zarape.modelo.Categoria;
import com.google.gson.Gson;
import org.bucket.zarape.controller.ControllerCategoria;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import java.sql.SQLException;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;


@Path("categoria")
public class RESTCategoria {

    @Path("/ping")
    @Produces(MediaType.TEXT_PLAIN)
    @POST
    public Response ping() {
        return Response.ok("¡Servidor en funcionamiento!").build();
    }

    @GET
    @Path("getAll")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll() {
        String respuesta;
        List<Categoria> categoria; 
        ControllerCategoria cb = new ControllerCategoria();
        
        try {
            categoria = cb.getAllCategorias();
            respuesta = new Gson().toJson(categoria); 
        } catch (Exception e) {
            e.printStackTrace();
            respuesta = "{\"error\":\"ocurrió un error\"}";
        }
        
        return Response.status(Response.Status.OK)
                       .entity(respuesta)
                       .build();  
    }
    
    @GET
    @Path("getAllA")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllA() {
        String out = null;
        List<Categoria> categorias = null;
        ControllerCategoria cc = new ControllerCategoria();
        
        try{
            categorias = cc.getAllA();
            out = new Gson().toJson(categorias);
        }catch(SQLException e){
            out = """
                  {"error","Ocurrio un error, intentelo más tarde"}
                  """+e;
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }
    
    @Path("getAllB")
    @Produces(MediaType. APPLICATION_JSON)
    @GET
    public Response getAllB(){        
        String out = null;
        List<Categoria> categorias = null;
        ControllerCategoria cc = new ControllerCategoria();
        
        try{
            categorias = cc.getAllB();
            out = new Gson().toJson(categorias);
        }catch(SQLException e){
            out = """
                  {"error","Ocurrio un error, intentelo más tarde"}
                  """+e;
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }
}