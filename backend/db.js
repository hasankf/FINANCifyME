import dotenv from 'dotenv' ;
import pkg from 'pg' ; 

dotenv.config() ;

const{ Pool, types } = pkg ;

types.setTypeParser(1082, (val) => val ) ;

const pool = new Pool({
    connectionString : process.env.DATABASE_URL ,
    ssl: { rejectUnauthorized: false},
});

pool.on("connect", () => {
    console.log("CONNECTED TO NEON POSTGRES") ;
})

pool.on("error", (err) => {
    console.error("unexpected postgres ERROR");
    console.exit(-1);
}) ;

export default pool ;