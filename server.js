import session from "express-session";
import cookieParser from "cookie-parser";
import express from "express";
import mysql from "mysql";
import cors from "cors";
import bodyParser from "body-parser";
import {sha256,sha224} from 'js-sha256'
import bcrypt from 'bcryptjs'

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
app.use(cookieParser());


const db =mysql.createConnection({
  host:"localhost", 
  user:"root", 
  password:"Furiosa1234#",
  database:"gasto_web"
})

app.get('/',(req,res)=>{
    if (req.session.idUsuario){
        return res.json({valid:true,idUsuario:req.session.idUsuario})
    }else{
        return res.json({valid:false})
    }
})

app.post('/signup',(req,res)=>{
    const sql = "INSERT INTO usuarios (`nombre`,`correo`,`contraseña`) VALUES (?)";
    //var hash = bcrypt.hashSync(req.body.password, 8);
    
    var hash = sha256.create();
    hash.update(req.body.password);
    hash.hex;
    console.log(hash)
    
    const values=[
        req.body.name,
        req.body.email,
        hash
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

    
    var hash = sha256.create();
    hash.update(req.body.password);
    hash.hex;
    
   //var hash = bcrypt.hashSync(req.body.password, 8);

    db.query(sql,[req.body.email,hash],(err,result)=>{
        console.log(hash)
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


app.listen(8081,()=>{
    console.log("listening")
})