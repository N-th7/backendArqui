import mysql from "mysql";

const db =mysql.createConnection({
    host:"localhost", 
    user:"root", 
    password:"Furiosa1234#",
    database:"controlgastos"
  })

  export default db ; 