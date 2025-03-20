package serviciosRest;

import org.bucket.zarape.modelo.Alimento;
import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import org.bucket.zarape.controller.ControllerAlimento;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.List;


@Path("alimento")
public class RESTAlimentos {
    
    private static List<Alimento> alimentos = new ArrayList<>();
    
    @Path("add")
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response agregar(@FormParam("datosAlimento") @DefaultValue("") String alimento) {
        String out = null;
        Alimento a = null;
        ControllerAlimento ctrl = null;
        Gson gson = new Gson();
        
        try {
            a = gson.fromJson(alimento, Alimento.class);
            ctrl = new ControllerAlimento();
            System.out.println(a);
            if(a.getIdAlimento()<1){
                a.setIdAlimento(ctrl.add(a).getIdAlimento());
            }
            out = gson.toJson(a);
        } catch (JsonSyntaxException jpe) {
            out = "{\"error\":\"formato de datos no valido\"}";
            jpe.printStackTrace();
        } catch (Exception ex) {
            out = "{\"error\":\"ocurrio un error\"}";
            System.out.println(ex);
            ex.printStackTrace();
        }
        return Response.status(Response.Status.OK)
                       .entity(out)
                       .build();  
    }
    
        @Path("update")
@Produces(MediaType.APPLICATION_JSON)
@POST
public Response actualizar(@FormParam("datosAlimento") @DefaultValue("") String alimento) {
    String out = null;
    Alimento a = null;
    ControllerAlimento ctrl = null;
    Gson gson = new Gson();
    
    try {
        a = gson.fromJson(alimento, Alimento.class);
        ctrl = new ControllerAlimento();
        System.out.println(a);
        out = gson.toJson(a);
        ctrl.update(a);
    } catch (JsonSyntaxException jpe) {
        out = "{\"error\":\"formato de datos no valido\"}";
        jpe.printStackTrace();
    } catch (Exception ex) {
        out = "{\"error\":\"ocurrio un error\"}";
        System.out.println(ex);
        ex.printStackTrace();
    }
    return Response.status(Response.Status.OK)
                   .entity(out)
                   .build();  
}

    @Path("ping")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    
    public Response revisarServicio (){
        String out = null;
        out = """
              {
              "resultado":"servicioCorriendo"
              }
              """;
        return Response.status(Response.Status.OK).entity(out).build();  
    }
    
    
    


    @Path("delete")
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response delete(@FormParam("idAlimento") @DefaultValue("0") int idAlimento) {
        String out = null;
        ControllerAlimento ctrl = null;
        
        try {
            ctrl = new ControllerAlimento();
            ctrl.delete(idAlimento);
            out = String.format("{\"mensaje\":\"Alimento con ID %d eliminado correctamente.\"}", idAlimento);
            return Response.status(Response.Status.OK).entity(out).build();
        } catch (Exception ex) {
            out = "{\"error\":\"Error interno del servidor\"}";
            ex.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(out).build();
        }
    }

    @GET
    @Path("getAll")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll() {
        String respuesta;
        List<Alimento> alimentos; 
        ControllerAlimento eb = new ControllerAlimento();
        
        try {
            alimentos = eb.getAll();
            respuesta = new Gson().toJson(alimentos); 
        } catch (Exception e) {
            e.printStackTrace();
            respuesta = "{\"error\":\"ocurrió un error\"}";
        }
        
        return Response.status(Response.Status.OK)
                       .entity(respuesta)
                       .build();  
    }
}