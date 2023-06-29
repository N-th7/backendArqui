import mysql from "mysql";

const db =mysql.createConnection({
    host:"192.168.1.3", 
    user:"root", 
    password:"Furiosa1234#",
    database:"controlgastos"
  })

  export default db ; 