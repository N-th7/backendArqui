import session from "express-session";
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import db from "./db/db.js"


const app= express();

app.use(cors({
    origin:["http://localhost:3000"],
    methods:["POST","GET"],
    credentials:true
}));

app.use(bodyParser.json())
app.use(express.json())
app.use(session ({
    secret:'secret',
    resave:false,
    saveUninitialized:false,
    cookie:{ 
        secure:false,
        maxAge:1000*60*60*24
    }
}));
//app.use(cookieParser());




app.get('/',(req,res)=>{
    if (req.session.idUsuario){
        return res.json({valid:true,idUsuario:req.session.idUsuario})
    }else{
        return res.json({valid:false})
    }
})

app.post('/signup',(req,res)=>{
    const sql = "INSERT INTO usuarios (`nombre`,`correo`,`contraseña`) VALUES (?)";
    const values=[
        req.body.name,
        req.body.email,
        req.body.password
    ]
    db.query(sql,[values],(err,data)=>{
        if(err){
            return res.json("Error"); 
        }
        return res.json(data);
    })
})

app.post('/Registro',(req,res)=>{
    const sql = "INSERT INTO movimientos (`idMovimiento`,`descripcion`,`monto`,`fecha`,`descuento`,`tipo`,`idUsuario`) VALUES (?)";
    const values=[
        req.body.idMovimiento,
        req.body.descripcion,
        req.body.monto,
        req.body.fecha,
        req.body.descuento,
        req.body.tipo,
        req.body.idUsuario
    ]
    db.query(sql,[values],(err,data)=>{
        console.log("entro")
        if(err){
            return res.json("Error"); 
        }
        return res.json(data);
        
    })
})

app.post('/login',(req,res)=>{
    const sql ="SELECT * FROM usuarios WHERE `correo`= ? AND `contraseña` = ?";
    db.query(sql,[req.body.email,req.body.password],(err,result)=>{
        if(err){
            return res.json({Message:"Error"});
        }
        if(result.length > 0 ){
            req.session.idUsuario=result[0].idUsuario;
            req.session.nombre=result[0].nombre;
            req.session.correo=result[0].correo;
            var id=req.session.idUsuario
            var nombre=req.session.nombre
            var correo=req.session.correo
            
            return (
                res.json({Login:true, idUsuario:id, nombre:nombre, correo:correo})
                );
            
        }else{
            return res.json({Login:false});
        }
    })
})


app.post('/reporte',(req,res)=>{
    
    const sql ="SELECT * FROM movimientos WHERE `idUsuario`= ?";

    db.query(sql,[req.body.idUsuario],(err,result)=>{
        if(err){
            return res.json({Message:"Error"});
        }
        if(result.length > 0){
            req.session.data=result[0].data
            var info=req.session.data
            return res.json({Movimientos:result.length,Res:result});
            
        }else{
            return res.json({Movimientos:0});
        }
    })
})

app.post('/reporte',(req,res)=>{
    
    const sql ="SELECT * FROM movimientos WHERE `idUsuario`= ?";

    db.query(sql,[req.body.idUsuario],(err,result)=>{
        if(err){
            return res.json({Message:"Error"});
        }
        if(result.length > 0){
            req.session.data=result[0].data
            var info=req.session.data
            console.log("entro")
            return res.json({Movimientos:result.length,Res:result});
            
        }else{
            return res.json({Movimientos:0});
        }
    })
})

app.post('/reporte/borrarMov',(req,res)=>{
    console.log(req.body.idMovimiento)
    const sql ="DELETE FROM movimientos WHERE `idMovimiento`= ?";
    db.query(sql,[req.body.idMovimiento],(err,result)=>{
        if(err){
            return res.json({Message:"Error"});
        }
        if(result.length > 0){
            req.session.data=result[0].data
            var info=req.session.data
            return res.json({Movimientos:result.length,Res:result});
            
        }else{
            return res.json({Movimientos:0});
        }
    })
})





app.listen(8081,()=>{
    console.log("listening")
})