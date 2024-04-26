const { connect, default: mongoose } = require("mongoose");
const app = require("./src/app");
const { config } = require("./src/config");
const router = require("./src/routes");
const { errorHandler, notFound } = require("./src/middlewares/error.middleware");
app.use("/api/v1", router);
app.all("*", notFound);
app.use(errorHandler);
const {engine} = require("express-handlebars")

app.engine('.handlebars', engine({extname: '.handlebars'}));
app.set('view engine', '.handlebars');
app.set('views', '../src/views');

app.listen(config.PORT, async()=>{
    try{
    // connect to database
    console.log("connecting to database");
    mongoose.set("strictQuery", true);
    connect(config.DB_URL);
    console.log("database connected successfully...");
    console.log(`server is running on localhost:${config.PORT}`);
}catch(error){
    console.log(error);
    process.exit(-1);
}
})